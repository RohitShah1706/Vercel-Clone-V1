import express from "express";
import cors from "cors";

import { DEPLOY_SERVICE_LOGS_KAFKA_TOPIC } from "./config";
import { prismaClient } from "./connection/prisma";
import { getRedisClient } from "./connection/redis";
import { getKafkaInstance } from "./connection/kafka";
import { removeAnsiEscapeCodes } from "./utils/ansiEscapeCodeRemover";
import { randomIdGenerator } from "./utils/randomIdGenerator";
import { decrypt } from "./utils/cryptoUtils";

const app = express();
const kafka = getKafkaInstance(`upload-service-${randomIdGenerator()}`);
const producer = kafka.producer();
const consumer = kafka.consumer({
	// ! groupId will allow kafka to allow a pool of consumers to divide the work of processing records from topics
	groupId: "upload-service-logs-consumer",
});
const publisher = getRedisClient();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
	console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
	next();
});

// ! routers
app.use("/repos", require("./routers/repoRouter").default);
app.use("/users", require("./routers/userRouter").default);
app.use("/projects", require("./routers/projectRouter").default);
app.use("/logs", require("./routers/logRouter").default);
app.use("/envvars", require("./routers/envVarRouter").default);
app.use(
	"/deployments",
	// ! pass the publisher to the deploymentRouter so that it can publish messages to the redis server
	require("./routers/deploymentRouter").default(publisher, producer)
);

app.post("/decrypt", async (req, res) => {
	const {
		encryptedString,
	}: {
		encryptedString: string;
	} = req.body;

	try {
		const decryptedString = decrypt(encryptedString);
		res.status(200).json({ decryptedString });
	} catch (error) {
		res.status(400).json({ message: "Invalid encrypted string" });
	}
});

const initKafkaConsumer = async () => {
	console.log("Consuming deploy logs from", DEPLOY_SERVICE_LOGS_KAFKA_TOPIC);
	await consumer.subscribe({
		topic: DEPLOY_SERVICE_LOGS_KAFKA_TOPIC,
		// ! fromBeginning: false => only new messages produced after the consumer has started will be consumed
		// ! fromBeginning: true => all messages even those produced before the consumer has started will be consumed
		fromBeginning: true,
	});

	await consumer.run({
		eachBatchAutoResolve: false,
		eachBatch: async function ({
			batch,
			heartbeat,
			isRunning,
			isStale,
			resolveOffset,
		}) {
			const messages = batch.messages;
			// console.log(`Received. ${messages.length} messages..`);
			for (const message of messages) {
				if (!isRunning() || isStale()) {
					console.log("Consumer is not running or is stale");
					break;
				}
				if (!message.value) continue;
				const stringMessage = message.value.toString();
				const { log, deploymentId, time } = JSON.parse(stringMessage);
				try {
					await prismaClient.logEvent.create({
						data: {
							deploymentId,
							log: removeAnsiEscapeCodes(log),
							timestamp: new Date(time),
						},
					});
					// TODO: insert log into database
					resolveOffset(message.offset);
					await heartbeat();
				} catch (err) {
					console.log(err);
				}
			}
		},
	});
};

const PORT = 5000;

const startServer = async () => {
	try {
		await publisher.connect();
		console.log("Connected to Redis");
		await producer.connect();
		await consumer.connect();
		console.log("Connected to Kafka");
		await prismaClient.$connect();
		console.log("Connected to Postgresql");
		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
		initKafkaConsumer();
	} catch (error) {
		// ! exit gracefully
		console.log(error);
		try {
			await publisher.quit();
		} catch (publisherError) {
			console.log("Failed to disconnect from Redis:", publisherError);
		}
		try {
			await prismaClient.$disconnect();
		} catch (prismaError) {
			console.log("Failed to disconnect from Postgresql:", prismaError);
		}
		process.exit(1);
	}
};

startServer();
