import {Router} from "express";
import {Prisma} from "@prisma/client";
import {z} from "zod";

import {authenticateGithub} from "../middlewares";
import {prismaClient} from "../connection/prisma";

const router = Router();

router.get("/:id", authenticateGithub, async (req, res) => {
	const {id} = req.params;

	const user = await prismaClient.user.findUnique({
		where: {
			id,
		},
		select: {
			email: true,
		},
	});

	if (user === null) {
		return res.status(404).json({message: "User not found"});
	}

	if (user.email !== res.locals.emailId) {
		return res.status(403).json({message: "Forbidden"});
	}

	return res.json(user);
});

router.post("/", authenticateGithub, async (req, res) => {
	const UserRequestBody = z.object({
		email: z.string().email("Invalid email"),
	});

	const parsed = UserRequestBody.safeParse(req.body);

	if (!parsed.success) {
		return res.status(400).json({errors: parsed.error.formErrors.fieldErrors});
	}

	const {email} = parsed.data;

	try {
		const user = await prismaClient.user.create({
			data: {
				email,
			},
			select: {
				email: true,
			},
		});
		return res.status(201).json({user, message: "User created"});
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === "P2002") {
				return res.status(400).json({message: "User already exists"});
			}
		}

		console.error("Error creating user:", error);
		return res.status(500).json({message: "Error creating user"});
	}
});

export default router;
