import {Router} from "express";
import {z} from "zod";

import {prismaClient} from "../connection/prisma";
import {authenticateGithub} from "../middlewares";
import {toTypedPrismaError} from "../utils/prismaErrorMap";
import {decrypt, encrypt} from "../utils/cryptoUtils";

const router = Router();

router.post("/:id", authenticateGithub, async (req, res) => {
	const {id} = req.params;
	const CreateEnvVarRequestBody = z.object({
		key: z.string().min(1, "Key is required"),
		value: z.string().min(1, "Value is required"),
	});

	const parsed = CreateEnvVarRequestBody.safeParse(req.body);
	if (!parsed.success) {
		return res.status(400).json({message: parsed.error.errors[0].message});
	}

	const {key, value} = parsed.data;

	const project = await prismaClient.project.findUnique({
		where: {
			id: id,
		},
		select: {
			id: true,
			userEmailId: true,
		},
	});

	if (project === null) {
		return res.status(404).json({message: "Project not found"});
	}

	if (project.userEmailId !== res.locals.emailId) {
		return res.status(403).json({message: "Forbidden"});
	}

	try {
		await prismaClient.envVar.create({
			data: {
				key,
				encryptedValue: encrypt(value),
				projectId: id,
			},
		});

		return res.status(201).json({
			message: "Environment variable created successfully",
			key,
		});
	} catch (error) {
		const typedError = toTypedPrismaError(error);
		if (typedError !== null) {
			return res.status(400).json({error: typedError});
		}
		console.error("Error creating env var:", error);
		return res.status(500).json({message: "Error creating project"});
	}
});

router.get("/:id", authenticateGithub, async (req, res) => {
	const {id} = req.params;
	const key = req.query.key as string;

	const project = await prismaClient.project.findUnique({
		where: {
			id,
		},
		select: {
			id: true,
			userEmailId: true,
		},
	});

	if (project === null) {
		return res.status(404).json({message: "Project not found"});
	}

	if (project.userEmailId !== res.locals.emailId) {
		return res.status(403).json({message: "Forbidden"});
	}

	const envVar = await prismaClient.envVar.findUnique({
		where: {
			key_projectId: {
				key,
				projectId: id,
			},
		},
		select: {
			key: true,
			encryptedValue: true,
		},
	});

	if (envVar === null) {
		return res.status(404).json({message: "Environment variable not found"});
	}

	return res.status(200).json({
		key: envVar.key,
		value: decrypt(envVar.encryptedValue),
	});
});

router.put("/:id", authenticateGithub, async (req, res) => {
	const {id} = req.params;

	const UpdateEnvVarRequestBody = z.object({
		key: z.string().min(1, "Key is required"),
		value: z.string().min(1, "Value is required"),
	});

	const parsed = UpdateEnvVarRequestBody.safeParse(req.body);
	if (!parsed.success) {
		return res.status(400).json({message: parsed.error.errors[0].message});
	}

	const {key, value} = parsed.data;

	const project = await prismaClient.project.findUnique({
		where: {
			id,
		},
		select: {
			id: true,
			userEmailId: true,
		},
	});

	if (project === null) {
		return res.status(404).json({message: "Project not found"});
	}

	if (project.userEmailId !== res.locals.emailId) {
		return res.status(403).json({message: "Forbidden"});
	}

	const envVar = await prismaClient.envVar.findUnique({
		where: {
			key_projectId: {
				key,
				projectId: id,
			},
		},
		select: {
			key: true,
		},
	});

	if (envVar === null) {
		return res.status(404).json({message: "Environment variable not found"});
	}

	await prismaClient.envVar.update({
		where: {
			key_projectId: {
				key,
				projectId: id,
			},
		},
		data: {
			encryptedValue: encrypt(value),
		},
	});

	return res
		.status(200)
		.json({message: "Environment variable updated successfully"});
});

router.delete("/:id", authenticateGithub, async (req, res) => {
	const {id} = req.params;
	const key = req.query.key as string;

	const project = await prismaClient.project.findUnique({
		where: {
			id,
		},
		select: {
			id: true,
			userEmailId: true,
		},
	});

	if (project === null) {
		return res.status(404).json({message: "Project not found"});
	}

	if (project.userEmailId !== res.locals.emailId) {
		return res.status(403).json({message: "Forbidden"});
	}

	const envVar = await prismaClient.envVar.findUnique({
		where: {
			key_projectId: {
				key,
				projectId: id,
			},
		},
		select: {
			key: true,
		},
	});

	if (envVar === null) {
		return res.status(404).json({message: "Environment variable not found"});
	}

	await prismaClient.envVar.delete({
		where: {
			key_projectId: {
				key,
				projectId: id,
			},
		},
	});

	return res
		.status(200)
		.json({message: "Environment variable deleted successfully"});
});

export default router;
