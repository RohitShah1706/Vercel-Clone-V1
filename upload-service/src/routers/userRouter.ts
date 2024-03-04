import { Router } from "express";
import { Prisma } from "@prisma/client";
import { z } from "zod";

import { authenticateGithub } from "../middlewares";
import { prismaClient } from "../connection/prisma";
import { Octokit } from "@octokit/rest";

const router = Router();

router.get("/", authenticateGithub, async (req, res) => {
	const user = await prismaClient.user.findUnique({
		where: {
			email: res.locals.emailId,
		},
		select: {
			email: true,
			username: true,
		},
	});

	if (user === null) {
		return res.status(404).json({ message: "User not found" });
	}

	if (user.email !== res.locals.emailId) {
		return res.status(403).json({ message: "Forbidden" });
	}

	return res.json(user);
});

router.post("/", authenticateGithub, async (req, res) => {
	const UserRequestBody = z.object({
		email: z.string().email("Invalid email"),
	});

	const parsed = UserRequestBody.safeParse(req.body);

	if (!parsed.success) {
		return res
			.status(400)
			.json({ errors: parsed.error.formErrors.fieldErrors });
	}

	const { email } = parsed.data;

	const octokit = new Octokit({ auth: res.locals.accessToken });

	// get user profile info
	const githubUser = await octokit.users.getAuthenticated();

	try {
		const user = await prismaClient.user.create({
			data: {
				email,
				username: githubUser.data.login,
			},
			select: {
				email: true,
				username: true,
			},
		});
		return res.status(201).json({ user, message: "User created" });
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === "P2002") {
				return res.status(400).json({ message: "User already exists" });
			}
		}

		console.error("Error creating user:", error);
		return res.status(500).json({ message: "Error creating user" });
	}
});

export default router;
