import { Router } from "express";
import { z } from "zod";
import simpleGit from "simple-git";
import path from "path";
import { RedisClientType } from "redis";
import { Producer } from "kafkajs";

import { DEPLOY_SERVICE_TASKS_KAFKA_TOPIC } from "../config";
import { prismaClient } from "../connection/prisma";
import { authenticateGithub } from "../middlewares";
import { getAllFiles, removeFolder } from "../utils/file";
import { uploadFile } from "../utils/aws";
import { toTypedPrismaError } from "../utils/prismaErrorMap";
import { publishMessage } from "../utils/kafka";

module.exports.default = (publisher: RedisClientType, producer: Producer) => {
	const router = Router();

	// ! ONLY FOR TESTING TO TRIGGER A DEPLOYMENT DIRECTLY
	// router.post("/send", async (req, res) => {
	// 	const {id}: {id: string} = req.body;

	// 	await publishMessage({
	// 		producer,
	// 		topic: DEPLOY_SERVICE_TASKS_KAFKA_TOPIC,
	// 		key: "deploy-task",
	// 		message: id,
	// 	});
	// 	res.status(200).json({message: "Message sent"});
	// });

	router.post("/deploy", authenticateGithub, async (req, res) => {
		const DeployRequestBody = z.object({
			projectId: z.string().min(1),
			branch: z.string().min(1),
			commitId: z.string().length(40),
		});

		const parsed = DeployRequestBody.safeParse(req.body);

		if (!parsed.success) {
			return res
				.status(400)
				.json({ errors: parsed.error.formErrors.fieldErrors });
		}

		const { projectId } = parsed.data;
		const emailId = res.locals.emailId;
		const accessToken = res.locals.accessToken;

		var { branch, commitId } = parsed.data;
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
				return res.status(404).json({ message: "Project not found" });
			}

			if (existingProject.userEmailId !== emailId) {
				return res.status(403).json({ message: "Forbidden" });
			}

			githubProjectName = existingProject.githubProjectName;
		} catch (error) {
			const typedError = toTypedPrismaError(error);
			if (typedError !== null) {
				return res.status(400).json({ error: typedError });
			}
			return res.status(500).json({ message: "Error updating project" });
		}

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
				await prismaClient.deployment.update({
					where: {
						id: deploymentId,
					},
					data: {
						status: "FAILED",
					},
				});
				await publisher.hSet("status", deploymentId, "FAILED");
				return res
					.status(400)
					.json({ message: "Invalid URL or Branch or Commit ID" });
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
					})
				);
			} catch (error) {
				removeFolder(outputPath);
				return res.status(500).json({ message: "Error uploading files" });
			}

			// ! update the last deployment id in the project
			await prismaClient.project.update({
				where: {
					id: projectId,
				},
				data: {
					lastDeploymentId: deploymentId,
				},
			});

			// ! put the deploymentId on the Kafka DEPLOY_SERVICE_TASKS_KAFKA_TOPIC topic for deploy-service to consume
			// publisher.lPush("build-queue", deploymentId);
			await publishMessage({
				producer,
				topic: DEPLOY_SERVICE_TASKS_KAFKA_TOPIC,
				key: "deploy-task",
				message: deploymentId,
			});

			// ! users can poll /status/?deploymentId to check the status of their build
			publisher.hSet("status", deploymentId, deployment.status);

			// ! remove the cloned repository
			removeFolder(outputPath);

			// ! send the deployment as response
			return res.status(200).json(deployment);
		} catch (error) {
			const typedError = toTypedPrismaError(error);
			if (typedError !== null) {
				return res.status(400).json({ error: typedError });
			}
			return res.status(500).json({ message: "Error creating deployment" });
		}
	});

	router.get("/status", authenticateGithub, async (req, res) => {
		const StatusRequestQuery = z.object({
			id: z.string(),
		});

		const parsed = StatusRequestQuery.safeParse(req.query);

		if (!parsed.success) {
			return res
				.status(400)
				.json({ errors: parsed.error.formErrors.fieldErrors });
		}

		const { id } = parsed.data;

		const status = await publisher.hGet("status", id);
		if (status === null) {
			return res.status(400).json({ message: "Invalid ID" });
		}

		return res.status(200).json({ status });
	});

	router.get("/all/:projectId", authenticateGithub, async (req, res) => {
		const { projectId } = req.params;
		const emailId = res.locals.emailId;

		if (projectId === undefined || projectId === null) {
			return res.status(400).json({ message: "Invalid project ID" });
		}

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
				return res.status(404).json({ message: "Project not found" });
			}

			if (existingProject.userEmailId !== emailId) {
				return res.status(403).json({ message: "Forbidden" });
			}

			const deployments = await prismaClient.deployment.findMany({
				where: {
					projectId,
				},
				select: {
					id: true,
					branch: true,
					commitId: true,
					status: true,
					createdAt: true,
				},
				orderBy: {
					createdAt: "desc",
				},
			});

			const response = deployments.map((deployment, index) => {
				return {
					...deployment,
					githubProjectName: existingProject.githubProjectName,
					isActive: index === 0,
				};
			});

			return res.status(200).json(response);
		} catch (error) {
			const typedError = toTypedPrismaError(error);
			if (typedError !== null) {
				return res.status(400).json({ error: typedError });
			}
			return res.status(500).json({ message: "Error fetching deployments" });
		}
	});

	router.get("/:id", authenticateGithub, async (req, res) => {
		const { id } = req.params;
		const emailId = res.locals.emailId;

		if (id === undefined || id === null) {
			return res.status(400).json({ message: "Invalid deployment ID" });
		}

		try {
			const deployment = await prismaClient.deployment.findUnique({
				where: {
					id,
				},
				select: {
					id: true,
					branch: true,
					commitId: true,
					status: true,
					createdAt: true,
					projectId: true,
					logEvent: {
						select: {
							log: true,
						},
						orderBy: {
							timestamp: "asc",
						},
					},
				},
			});

			if (deployment === null) {
				return res.status(404).json({ message: "Deployment not found" });
			}

			const project = await prismaClient.project.findUnique({
				where: {
					id: deployment.projectId,
				},
				select: {
					userEmailId: true,
					githubProjectName: true,
				},
			});

			if (project === null) {
				return res.status(404).json({ message: "Project not found" });
			}

			if (project.userEmailId !== emailId) {
				return res.status(403).json({ message: "Forbidden" });
			}

			return res.status(200).json({
				...deployment,
				githubProjectName: project.githubProjectName,
			});
		} catch (error) {
			const typedError = toTypedPrismaError(error);
			if (typedError !== null) {
				return res.status(400).json({ error: typedError });
			}
			return res.status(500).json({ message: "Error fetching deployment" });
		}
	});

	return router;
};
