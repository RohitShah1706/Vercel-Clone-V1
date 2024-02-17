import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import {Octokit} from "@octokit/rest";
import path from "path";

import {REDIS_HOST, REDIS_PASSWORD, REDIS_PORT, MONGO_URI} from "./config";
import {getAllFiles, removeFolder} from "./file";
import {randomIdGenerator} from "./randomIdGenerator";
import {uploadFile} from "./aws";
import {getRedisClient} from "./connection/redis";
import {connectMongo} from "./connection/mongo";
import {decrypt, encrypt} from "./cryptoUtils";
import {saveEnvVars} from "./controllers/envVars";
import {authenticateGithub} from "./middlewares";

interface Repo {
	name: string;
	full_name: string;
	updated_at: string;
	clone_url: string;
	visibility: string;
	default_branch: string;
}

const app = express();
const publisher = getRedisClient(REDIS_HOST, REDIS_PASSWORD, REDIS_PORT);

app.use(cors());
app.use(express.json());

app.get("/repos", authenticateGithub, async (req, res) => {
	let visibility = req.query.visibility as string;
	if (!visibility) {
		visibility = "all";
	}

	if (!["all", "private", "public"].includes(visibility)) {
		visibility = "all";
	}

	const octokit = new Octokit({auth: req.accessToken});
	console.log("Fetching repositories with visibility:", visibility);
	try {
		let page = 1;
		let fetchMore = true;
		let allRepos: Repo[] = [];

		while (fetchMore) {
			try {
				const {data} = await octokit.repos.listForAuthenticatedUser({
					visibility: visibility as "all" | "private" | "public",
					per_page: 100,
					page: page,
				});

				const repos: Repo[] = data.map((repo: any) => ({
					name: repo.name,
					full_name: repo.full_name,
					updated_at: repo.updated_at,
					clone_url: repo.clone_url,
					visibility: repo.visibility,
					default_branch: repo.default_branch,
				}));

				allRepos = [...allRepos, ...repos];
				if (data.length < 100) {
					fetchMore = false;
				} else {
					page++;
				}
			} catch (error) {
				return res.status(500).json({error: "Error fetching repositories"});
			}
		}

		// sort allRepos by updated_at
		allRepos.sort((a, b) => {
			const dateA = new Date(a.updated_at).getTime();
			const dateB = new Date(b.updated_at).getTime();
			return dateB - dateA;
		});

		res.json(allRepos);
	} catch (error) {
		res.status(500).json({error: "Internal Server Error"});
	}
});

app.post("/upload", authenticateGithub, async (req, res) => {
	var {
		full_name,
		branch,
		commitId,
	}: {full_name: string; branch: string; commitId: string} = req.body;
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

	if (full_name === undefined || full_name === null) {
		res.status(400).json({message: "Invalid Full Name"});
		return;
	}

	if (branch === undefined || branch === null) {
		branch = "main";
	}

	if (commitId === undefined || commitId === null) {
		commitId = "HEAD";
	}

	// ! clone the repo
	const git = simpleGit();
	const oauth2Token = req.accessToken.split(" ")[1];
	try {
		const httpsRepoUrl = `https://oauth2:${oauth2Token}@github.com/${full_name}.git`;
		// console.log("cloning", httpsRepoUrl, branch, commitId);
		await git.clone(httpsRepoUrl, path.join(__dirname, `clonedRepos/${id}`), [
			"-b",
			branch,
		]);
		await git.cwd(path.join(__dirname, `clonedRepos/${id}`));
		await git.reset(["--hard", commitId]);
	} catch (error) {
		// console.log(error);
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
		removeFolder(path.join(__dirname, `clonedRepos/${id}`));
		res.status(500).json({message: "Error uploading files"});
		return;
	}

	// ! put the id on the redis "build-queue" for deploy-service to consume
	publisher.lPush("build-queue", id);

	// ! users can poll /status/?id to check the status of their build
	publisher.hSet("status", id, "uploaded");

	// ! remove the cloned repository
	removeFolder(path.join(__dirname, `clonedRepos/${id}`));

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
