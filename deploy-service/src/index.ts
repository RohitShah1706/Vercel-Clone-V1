import {commandOptions} from "redis";
import path from "path";

import {MONGO_URI} from "./config";
import {getRedisClient} from "./connection/redis";
import {copyFinalDistToS3, downloadS3Folder} from "./aws";
import {buildProject} from "./buildProject";
import {removeFiles} from "./file";
import {connectMongo} from "./connection/mongo";

const publisher = getRedisClient();
const subscriber = getRedisClient();

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

		await downloadS3Folder(`clonedRepos/${id}`);

		await buildProject(id);

		// ! wait for all files to upload
		await copyFinalDistToS3(id);

		// ! users can poll /status/?id on "upload-service" to check the status of their build
		publisher.hSet("status", id, "deployed");

		// ! remove the cloned repository
		removeFiles(path.join(__dirname, `clonedRepos/${id}`));
	}
};

const run = async () => {
	await publisher.connect();
	await subscriber.connect();
	console.log("Connected to Redis Queue");
	await connectMongo(MONGO_URI);
	console.log("Connected to MongoDB");
	consumeDeployTask();
};

run();
