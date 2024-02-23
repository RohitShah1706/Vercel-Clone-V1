import {commandOptions} from "redis";
import path from "path";

import {REDIS_HOST, REDIS_PASSWORD, REDIS_PORT, REDIS_SECURE} from "./config";
import {getRedisClient} from "./connection/redis";
import {copyFinalDistToS3, downloadS3Folder} from "./utils/aws";
import {buildProject} from "./utils/buildProject";
import {removeFolder} from "./utils/file";
import {toTypedPrismaError} from "./utils/prismaErrorMap";
import {prismaClient} from "./connection/prisma";

const redisConfig = {
	REDIS_HOST,
	REDIS_PASSWORD,
	REDIS_SECURE,
	REDIS_PORT,
};

const publisher = getRedisClient(redisConfig);
const subscriber = getRedisClient(redisConfig);

const consumeDeployTask = async () => {
	while (true) {
		const response = await subscriber.brPop(
			commandOptions({isolated: true}),
			"build-queue",
			0
		);
		console.log("response", response);
		const id = response?.element;

		if (id === undefined || id === null) {
			continue;
		}

		// ! check if the deployment exists
		try {
			const deployment = await prismaClient.deployment.findUnique({
				where: {
					id,
				},
				select: {
					Project: {
						select: {
							EnvVar: {
								select: {
									key: true,
									encryptedValue: true,
								},
							},
							build_cmd: true,
							install_cmd: true,
							root_dir: true,
							out_dir: true,
						},
					},
				},
			});

			if (deployment === null) {
				throw new Error(`No deployment found for id: ${id}`);
			} else {
				await downloadS3Folder(`clonedRepos/${id}`);

				const buildSuccess = await buildProject(id, deployment);

				// ! wait for all files to upload
				if (buildSuccess === true) {
					await copyFinalDistToS3(id, deployment.Project.out_dir);
				}

				const updatedDeployment = await prismaClient.deployment.update({
					where: {
						id,
					},
					data: {
						status: "SUCCESS",
					},
					select: {
						status: true,
					},
				});
				// ! users can poll /status/?id on "upload-service" to check the status of their build
				publisher.hSet("status", id, updatedDeployment.status);
			}
		} catch (error) {
			const typedError = toTypedPrismaError(error);
			if (typedError !== null) {
				console.error(`Error getting envVars for id: ${id}`, typedError);
			} else {
				console.log(error);
			}

			// ! users can poll /status/?id on "upload-service" to check the status of their build
			const updatedDeployment = await prismaClient.deployment.update({
				where: {
					id,
				},
				data: {
					status: "FAILED",
				},
				select: {
					status: true,
				},
			});
			publisher.hSet("status", id, updatedDeployment.status);
		}

		// // ! remove the cloned repository
		// removeFolder(path.join(__dirname, `clonedRepos/${id}`));
	}
};

const run = async () => {
	await publisher.connect();
	await subscriber.connect();
	console.log("Connected to Redis Queue");
	await prismaClient.$connect();
	console.log("Connected to Postgresql");
	consumeDeployTask();
};

run();
