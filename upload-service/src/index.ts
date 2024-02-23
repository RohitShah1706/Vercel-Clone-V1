import express from "express";
import cors from "cors";

import {REDIS_HOST, REDIS_PASSWORD, REDIS_PORT, REDIS_SECURE} from "./config";

import {prismaClient} from "./connection/prisma";
import {getRedisClient} from "./connection/redis";
import {decrypt} from "./utils/cryptoUtils";

const app = express();
const publisher = getRedisClient({
	REDIS_HOST,
	REDIS_PASSWORD,
	REDIS_PORT,
	REDIS_SECURE,
});

app.use(cors());
app.use(express.json());

// ! routers
app.use("/repos", require("./routers/repoRouter").default);
app.use("/users", require("./routers/userRouter").default);
app.use("/projects", require("./routers/projectRouter").default);
app.use(
	"/deployments",
	// ! pass the publisher to the deploymentRouter so that it can publish messages to the redis server
	require("./routers/deploymentRouter").default(publisher)
);

app.post("/decrypt", async (req, res) => {
	const {
		encryptedString,
	}: {
		encryptedString: string;
	} = req.body;

	try {
		const decrypted = decrypt(encryptedString);
		const jsonDecrypted = JSON.parse(decrypted);
		res.status(200).json(jsonDecrypted);
	} catch (error) {
		res.status(400).json({message: "Invalid encrypted string"});
	}
});

const PORT = 5000;

const startServer = async () => {
	try {
		await publisher.connect();
		console.log("Connected to Redis");
		await prismaClient.$connect();
		console.log("Connected to Postgresql");
		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
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
