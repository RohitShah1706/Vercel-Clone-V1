import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import path from "path";

import {REDIS_HOST, REDIS_PASSWORD, REDIS_PORT, MONGO_URI} from "./config";
import {getAllFiles, removeFiles} from "./file";
import {randomIdGenerator} from "./randomIdGenerator";
import {uploadFile} from "./aws";
import {getRedisClient} from "./connection/redis";
import {connectMongo} from "./connection/mongo";
import {decrypt, encrypt} from "./cryptoUtils";
import {EnvVarsModel} from "./models/envVars";
import {saveEnvVars} from "./controllers/envVars";

const app = express();
const publisher = getRedisClient(REDIS_HOST, REDIS_PASSWORD, REDIS_PORT);

app.use(cors());
app.use(express.json());

app.post("/upload", async (req, res) => {
	var {
		repoUrl,
		branch,
		commitId,
	}: {repoUrl: string; branch: string; commitId: string} = req.body;

	const {
		envVars,
	}: {
		envVars: {[key: string]: string};
	} = req.body;

	const id = randomIdGenerator();

	if (envVars !== undefined && envVars !== null) {
		// ! convert envVars to json string
		const envVarsString = JSON.stringify(envVars);
		const encryptedEnvVars = encrypt(envVarsString);

		// ! save the encrypted string in the database
		try {
			await saveEnvVars(id, encryptedEnvVars);
		} catch (error) {
			res.status(500).json({message: "Error saving env vars"});
			return;
		}
	}

	if (!repoUrl.endsWith(".git")) {
		repoUrl = repoUrl.concat(".git");
	}

	if (branch === undefined || branch === null) {
		branch = "main";
	}

	if (commitId === undefined || commitId === null) {
		commitId = "HEAD";
	}

	// ! clone the repo
	const git = simpleGit();
	try {
		await git.clone(repoUrl, path.join(__dirname, `clonedRepos/${id}`), [
			"-b",
			branch,
		]);
		await git.cwd(path.join(__dirname, `clonedRepos/${id}`));
		await git.reset(["--hard", commitId]);
	} catch (error) {
		console.log(error);
		res.status(400).json({message: "Invalid URL or Branch or Commit ID"});
		return;
	}

	// ! upload all files to s3
	// fileName example => D:/Projects/Vercel Clone/upload-service/src/clonedRepos/${id}/src/App.jsx
	// __dirname => D:/Projects/Vercel Clone/upload-service/src
	// so we use __dirname.length + 1 to remove till the "**src/" part
	const files = getAllFiles(path.join(__dirname, `clonedRepos/${id}`));

	try {
		await Promise.all(
			files.map((file) => {
				return uploadFile(file.slice(__dirname.length + 1), file);
			})
		);
	} catch (error) {
		removeFiles(path.join(__dirname, `clonedRepos/${id}`));
		res.status(500).json({message: "Error uploading files"});
		return;
	}

	// ! put the id on the redis "build-queue" for deploy-service to consume
	publisher.lPush("build-queue", id);

	// ! users can poll /status/?id to check the status of their build
	publisher.hSet("status", id, "uploaded");

	// ! remove the cloned repository
	removeFiles(path.join(__dirname, `clonedRepos/${id}`));

	// ! send the id as response
	res.status(200).json({id});
});

app.get("/status", async (req, res) => {
	const id = req.query.id as string;

	const status = await publisher.hGet("status", id);
	if (status === null) {
		res.status(400).json({message: "Invalid ID"});
		return;
	}

	res.status(200).json({status});
});

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
		await connectMongo(MONGO_URI);
		console.log("Connected to MongoDB");
		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	} catch (error) {
		// ! exit gracefully
		console.log(error);
		process.exit(1);
	}
};

startServer();
