import { createClient } from "redis";

import {
	REDIS_HOST,
	REDIS_PASSWORD,
	REDIS_PORT,
	REDIS_SECURE,
} from "../config";

export const getRedisClient = () => {
	const protocol = REDIS_SECURE === "true" ? "rediss" : "redis";
	console.log("REDIS_SECURE", REDIS_SECURE);
	return createClient({
		url: `${protocol}://${REDIS_HOST}:${REDIS_PORT}`,
		password: REDIS_PASSWORD,
	});
};
