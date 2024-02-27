import {Router} from "express";

import {prismaClient} from "../connection/prisma";
import {authenticateGithub} from "../middlewares";

const router = Router();

router.get("/:id", authenticateGithub, async (req, res) => {
	const {id} = req.params;

	const logs = await prismaClient.logEvent.findMany({
		where: {
			deploymentId: id,
		},
		select: {
			log: true,
		},
		orderBy: {
			timestamp: "asc",
		},
	});

	if (logs.length === 0) {
		return res.status(404).json({message: "No logs found"});
	}

	return res.json(logs);
});

export default router;
