import path from "path";

import { getKafkaInstance } from "./connection/kafka";
import { prismaClient } from "./connection/prisma";
import { getRedisClient } from "./connection/redis";
import { DEPLOY_SERVICE_TASKS_KAFKA_TOPIC } from "./config";
import { randomIdGenerator } from "./utils/randomIdGenerator";
import { copyFinalDistToS3, downloadS3Folder } from "./utils/aws";
import { buildProject } from "./buildProject";
import { removeFolder } from "./utils/file";
import { toTypedPrismaError } from "./utils/prismaErrorMap";

const kafka = getKafkaInstance(`deploy-service-${randomIdGenerator()}`);

const producer = kafka.producer();
const consumer = kafka.consumer({
	// ! groupId will allow kafka to allow a pool of consumers to divide the work of processing records from topics
	groupId: "deploy-service-task-consumer",
	// ! maxTime a consumer can go without sending a heartbeat to the broker
	// ! NOTE: if our deployment takes longer than this sessionTimeout(default 30000ms) then,
	// ! kafka might think that the consumer has died and reassign the partition to another consumer in the group
	sessionTimeout: 60000, // 1 minute - for long running deployments
});
const publisher = getRedisClient();

const consumeDeployTasks = async () => {
	console.log("Consuming deploy tasks from", DEPLOY_SERVICE_TASKS_KAFKA_TOPIC);
	await consumer.subscribe({
		topic: DEPLOY_SERVICE_TASKS_KAFKA_TOPIC,
		// ! fromBeginning: false => only new messages produced after the consumer has started will be consumed
		// ! fromBeginning: true => all messages even those produced before the consumer has started will be consumed
		fromBeginning: true,
	});

	await consumer.run({
		eachMessage: async ({ topic, partition, message }) => {
			const id = message.value?.toString();

			if (id === undefined || id === null) {
				return;
			}

			console.log("Received deploy task:", id);
			try {
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
						await publisher.hSet("status", id, "DEPLOYING");

						await downloadS3Folder(`clonedRepos/${id}`);
						console.log("calling buildProject");
						let buildSuccess = await buildProject(id, deployment, producer);

						// ! wait for all files to upload
						if (buildSuccess === true) {
							const copySuccess = await copyFinalDistToS3(
								id,
								deployment.Project.out_dir,
								producer
							);
							buildSuccess = copySuccess;
						}

						const updatedDeployment = await prismaClient.deployment.update({
							where: {
								id,
							},
							data: {
								status: buildSuccess ? "SUCCESS" : "FAILED",
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

				// ! remove the cloned repository
				removeFolder(path.join(__dirname, `clonedRepos/${id}`));

				// ! commit the message to mark the message as processed
				await consumer.commitOffsets([
					{
						topic: topic,
						partition: partition,
						offset: message.offset + 1,
					},
				]);
			} catch (error) {
				await publisher.hSet("status", id, "FAILED");
				console.error(error);
			}
		},
	});
};

const run = async () => {
	await consumer.connect();
	await producer.connect();
	console.log("Connected to Kafka");
	await publisher.connect();
	console.log("Connected to Redis");
	await prismaClient.$connect();
	console.log("Connected to Postgresql");
	consumeDeployTasks();
};

run();
