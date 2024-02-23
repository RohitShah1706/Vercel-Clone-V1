import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import {z} from "zod";
import path from "path";

import {REDIS_HOST, REDIS_PASSWORD, REDIS_PORT, REDIS_SECURE} from "./config";
import {getAllFiles, removeFolder} from "./file";
import {randomIdGenerator} from "./randomIdGenerator";
import {uploadFile} from "./aws";
import {prismaClient} from "./connection/prisma";
import {getRedisClient} from "./connection/redis";
import {decrypt, encrypt} from "./cryptoUtils";
import {saveEnvVars} from "./controllers/envVars";
import {authenticateGithub} from "./middlewares";

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

app.post("/upload", authenticateGithub, async (req, res) => {
	const UploadRequestBody = z.object({
		full_name: z.string().min(1),
		branch: z.string().optional(),
		commitId: z.string().length(40).optional(),
		envVars: z.record(z.string()).optional(),
	});

	const parsed = UploadRequestBody.safeParse(req.body);

	if (!parsed.success) {
		return res.status(400).json({errors: parsed.error.formErrors.fieldErrors});
	}

	var {full_name, branch, commitId, envVars} = parsed.data;

	const id = randomIdGenerator();

	if (envVars !== undefined && envVars !== null) {
		// ! convert envVars to json string
		const envVarsString = JSON.stringify(envVars);
		const encryptedEnvVars = encrypt(envVarsString);

		// ! save the encrypted string in the database
		// TODO: save this in postgres database
		// try {
		// 	await saveEnvVars(id, encryptedEnvVars);
		// } catch (error) {
		// 	res.status(500).json({message: "Error saving env vars"});
		// 	return;
		// }
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
	const oauth2Token = res.locals.accessToken.split(" ")[1] as string;
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
	const StatusRequestQuery = z.object({
		id: z.string(),
	});

	const parsed = StatusRequestQuery.safeParse(req.query);

	if (!parsed.success) {
		return res.status(400).json({errors: parsed.error.formErrors.fieldErrors});
	}

	const {id} = parsed.data;

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
