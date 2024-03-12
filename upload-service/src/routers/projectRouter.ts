import { Router } from "express";
import { z } from "zod";

import { prismaClient } from "../connection/prisma";
import { authenticateGithub } from "../middlewares";
import { toTypedPrismaError } from "../utils/prismaErrorMap";
import { encrypt } from "../utils/cryptoUtils";

const router = Router();

router.get("/:id", authenticateGithub, async (req, res) => {
	const { id } = req.params;
	const project = await prismaClient.project.findUnique({
		where: {
			id,
		},
		select: {
			id: true,
			name: true,
			githubProjectName: true,
			user: {
				select: {
					email: true,
				},
			},
			envVars: {
				select: {
					key: true,
				},
			},
			lastDeployment: {
				select: {
					id: true,
					status: true,
					branch: true,
					commitId: true,
					createdAt: true,
				},
			},
			rootDir: true,
			outDir: true,
			installCmd: true,
			buildCmd: true,
		},
	});

	if (project === null) {
		return res.status(404).json({ message: "Project not found" });
	}

	if (project.user.email !== res.locals.emailId) {
		return res.status(403).json({ message: "Forbidden" });
	}

	let envVars: Record<string, string> = {};
	for (const envVar of project.envVars) {
		envVars[envVar.key] = "";
	}

	const response = { ...project, envVars };

	return res.json(response);
});

router.post("/", authenticateGithub, async (req, res) => {
	const CreateProjectRequestBody = z.object({
		name: z.string().min(1, "Project name is required"),
		githubProjectName: z.string().min(1, "Github Project Name is required"),
		rootDir: z.string().optional(),
		outDir: z.string().optional(),
		installCmd: z.string().optional(),
		buildCmd: z.string().optional(),
		envVars: z.record(z.string()).optional(),
	});
	const parsed = CreateProjectRequestBody.safeParse(req.body);

	if (!parsed.success) {
		return res
			.status(400)
			.json({ errors: parsed.error.formErrors.fieldErrors });
	}

	const {
		name,
		githubProjectName,
		rootDir,
		outDir,
		installCmd,
		buildCmd,
		envVars,
	} = parsed.data;

	const emailId = res.locals.emailId as string;
	var envVarList: {
		key: string;
		encryptedValue: string;
	}[] = [];

	if (envVars !== undefined && envVars !== null) {
		Object.entries(envVars).forEach(([key, value]) => {
			envVarList.push({
				key,
				encryptedValue: encrypt(value),
			});
		});
	}

	try {
		const project = await prismaClient.project.create({
			data: {
				name,
				githubProjectName,
				userEmailId: emailId,
				rootDir,
				outDir,
				installCmd,
				buildCmd,
				envVars: {
					createMany: {
						data: envVarList,
					},
				},
			},
			select: {
				id: true,
				name: true,
				githubProjectName: true,
				user: {
					select: {
						email: true,
					},
				},
				envVars: {
					select: {
						key: true,
					},
				},
				rootDir: true,
				outDir: true,
				installCmd: true,
				buildCmd: true,
			},
		});

		return res.status(201).json({ project, message: "Project created" });
	} catch (error) {
		const typedError = toTypedPrismaError(error);
		if (typedError !== null) {
			return res.status(400).json({ error: typedError });
		}
		console.error("Error creating project:", error);
		return res.status(500).json({ message: "Error creating project" });
	}
});

router.put("/:id", authenticateGithub, async (req, res) => {
	const UpdateProjectRequestBody = z.object({
		name: z.string().optional(),
		rootDir: z.string().optional(),
		outDir: z.string().optional(),
		installCmd: z.string().optional(),
		buildCmd: z.string().optional(),
	});
	const parsed = UpdateProjectRequestBody.safeParse(req.body);

	if (!parsed.success) {
		return res
			.status(400)
			.json({ errors: parsed.error.formErrors.fieldErrors });
	}

	const { name, rootDir, outDir, installCmd, buildCmd } = parsed.data;

	const projectId = req.params.id;
	const emailId = res.locals.emailId as string;

	try {
		const existingProject = await prismaClient.project.findUnique({
			where: {
				id: projectId,
			},
			select: {
				userEmailId: true,
			},
		});

		if (existingProject === null) {
			return res.status(404).json({ message: "Project not found" });
		}

		if (existingProject.userEmailId !== emailId) {
			return res.status(403).json({ message: "Forbidden" });
		}

		const project = await prismaClient.project.update({
			where: {
				id: projectId,
				userEmailId: emailId,
			},
			data: {
				name,
				userEmailId: emailId,
				rootDir,
				outDir,
				installCmd,
				buildCmd,
			},
			select: {
				id: true,
				name: true,
				githubProjectName: true,
				user: {
					select: {
						email: true,
					},
				},
				rootDir: true,
				outDir: true,
				installCmd: true,
				buildCmd: true,
			},
		});

		return res.status(200).json({ project, message: "Project updated" });
	} catch (error) {
		const typedError = toTypedPrismaError(error);
		if (typedError !== null) {
			return res.status(400).json({ error: typedError });
		}
		console.error("Error updating project:", error);
		return res.status(500).json({ message: "Error updating project" });
	}
});

router.get("/", async (req, res) => {
	const emailId = res.locals.emailId as string;

	const projects = await prismaClient.project.findMany({
		where: {
			userEmailId: emailId,
		},
		select: {
			id: true,
			name: true,
			githubProjectName: true,
			lastDeployment: {
				select: {
					id: true,
					status: true,
					commitId: true,
					branch: true,
					createdAt: true,
				},
			},
		},
	});

	return res.json(projects);
});

export default router;
