import {Router} from "express";
import {z} from "zod";
import simpleGit from "simple-git";
import path from "path";
import {getAllFiles, removeFolder} from "../utils/file";
import {uploadFile} from "../utils/aws";
import {RedisClientType} from "redis";

import {prismaClient} from "../connection/prisma";
import {authenticateGithub} from "../middlewares";
import {toTypedPrismaError} from "../utils/prismaErrorMap";
import {encrypt} from "../utils/cryptoUtils";

module.exports.default = (publisher: RedisClientType) => {
	const router = Router();

	router.post("/deploy", authenticateGithub, async (req, res) => {
		const UploadRequestBody = z.object({
			projectId: z.string().min(1),
			branch: z.string().optional(),
			commitId: z.string().length(40).optional(),
		});

		const parsed = UploadRequestBody.safeParse(req.body);

		if (!parsed.success) {
			return res
				.status(400)
				.json({errors: parsed.error.formErrors.fieldErrors});
		}

		const {projectId} = parsed.data;
		const emailId = res.locals.emailId;
		const accessToken = res.locals.accessToken;

		var {branch, commitId} = parsed.data;
		var githubProjectName: string;

		try {
			const existingProject = await prismaClient.project.findUnique({
				where: {
					id: projectId,
				},
				select: {
					userEmailId: true,
					githubProjectName: true,
				},
			});

			if (existingProject === null) {
				return res.status(404).json({message: "Project not found"});
			}

			if (existingProject.userEmailId !== emailId) {
				return res.status(403).json({message: "Forbidden"});
			}

			githubProjectName = existingProject.githubProjectName;
		} catch (error) {
			const typedError = toTypedPrismaError(error);
			if (typedError !== null) {
				return res.status(400).json({error: typedError});
			}
			return res.status(500).json({message: "Error updating project"});
		}

		// TODO: replace with deployment id from Deployment table
		try {
			const deployment = await prismaClient.deployment.create({
				data: {
					projectId,
					branch,
					commitId,
				},
				select: {
					id: true,
					branch: true,
					commitId: true,
					status: true,
					createdAt: true,
					project: {
						select: {
							id: true,
						},
					},
				},
			});
			const deploymentId = deployment.id;

			if (branch === undefined || branch === null) {
				branch = "main";
			}

			if (commitId === undefined || commitId === null) {
				commitId = "HEAD";
			}

			// ! clone the repo
			const git = simpleGit();
			const oauth2Token = accessToken.split(" ")[1] as string;
			const outputPath = path.join(__dirname, `../clonedRepos/${deploymentId}`);
			try {
				const httpsRepoUrl = `https://oauth2:${oauth2Token}@github.com/${githubProjectName}.git`;
				// console.log("cloning", httpsRepoUrl, branch, commitId);
				await git.clone(httpsRepoUrl, outputPath, ["-b", branch]);
				await git.cwd(outputPath);
				await git.reset(["--hard", commitId]);
			} catch (error) {
				// console.log(error);
				removeFolder(outputPath);
				return res
					.status(400)
					.json({message: "Invalid URL or Branch or Commit ID"});
			}

			// ! upload all files to s3
			// fileName example => D:/Projects/Vercel Clone/upload-service/src/clonedRepos/${id}/src/App.jsx
			// __dirname => D:/Projects/Vercel Clone/upload-service/src
			// so we use __dirname.length + 1 to remove till the "**src/" part
			const files = getAllFiles(outputPath);

			try {
				await Promise.all(
					files.map((file) => {
						return uploadFile(
							file.slice(path.join(__dirname, "../").length),
							file
						);
						// return uploadFile(file.slice(__dirname.length + 1), file);
					})
				);
			} catch (error) {
				removeFolder(outputPath);
				return res.status(500).json({message: "Error uploading files"});
			}

			// ! put the deploymentId on the redis "build-queue" for deploy-service to consume
			publisher.lPush("build-queue", deploymentId);

			// ! users can poll /status/?deploymentId to check the status of their build
			publisher.hSet("status", deploymentId, deployment.status);

			// ! remove the cloned repository
			removeFolder(outputPath);

			// ! send the deployment as response
			return res.status(200).json(deployment);
		} catch (error) {
			const typedError = toTypedPrismaError(error);
			if (typedError !== null) {
				return res.status(400).json({error: typedError});
			}
			return res.status(500).json({message: "Error creating deployment"});
		}
	});

	router.get("/status", async (req, res) => {
		const StatusRequestQuery = z.object({
			id: z.string(),
		});

		const parsed = StatusRequestQuery.safeParse(req.query);

		if (!parsed.success) {
			return res
				.status(400)
				.json({errors: parsed.error.formErrors.fieldErrors});
		}

		const {id} = parsed.data;

		const status = await publisher.hGet("status", id);
		if (status === null) {
			return res.status(400).json({message: "Invalid ID"});
		}

		return res.status(200).json({status});
	});

	return router;
};
