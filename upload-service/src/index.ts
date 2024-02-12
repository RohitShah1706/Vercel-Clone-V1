import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import path from "path";
import fs from "fs";

import {getAllFiles} from "./file";
import {randomIdGenerator} from "./randomIdGenerator";
import {uploadFile} from "./aws";
import {getRedisClient} from "./connection/redis";

const app = express();
const publisher = getRedisClient();

app.use(cors());
app.use(express.json());

app.post("/upload", async (req, res) => {
	var {
		repoUrl,
		branch,
		commitId,
	}: {repoUrl: string; branch: string; commitId: string} = req.body;

	if (branch === undefined || branch === null) {
		branch = "main";
	}

	if (commitId === undefined || commitId === null) {
		commitId = "HEAD";
	}

	console.log("repoUrl", repoUrl);
	console.log("branch", branch);
	console.log("commitId", commitId);

	const id = randomIdGenerator();

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
	files.forEach(async (file) => {
		await uploadFile(file.slice(__dirname.length + 1), file);
	});

	// ! put the id on the redis "build-queue" for deploy-service to consume
	publisher.lPush("build-queue", id);
	// TODO: kya hai ye hashset
	// publisher.hSet("status", id, "uploaded");

	// ! remove the cloned repository
	fs.rmSync(path.join(__dirname, `clonedRepos/${id}`), {
		recursive: true,
		force: true,
	});

	// ! send the id as response
	res.status(200).json({id});
});

const PORT = 5000;

const startServer = async () => {
	try {
		await publisher.connect();

		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	} catch (error) {
		// exit gracefully
		console.log(error);
		process.exit(1);
	}
};

startServer();
