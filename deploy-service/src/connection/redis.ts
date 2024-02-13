import {createClient} from "redis";

import {REDIS_HOST, REDIS_PORT, REDIS_PASSWORD} from "../config";

export const getRedisClient = () => {
	return createClient({
		url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
		password: REDIS_PASSWORD,
	});
};
