import {createClient} from "redis";

export const getRedisClient = (
	REDIS_HOST: string,
	REDIS_PASSWORD: string,
	REDIS_PORT: string
) => {
	return createClient({
		url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
		password: REDIS_PASSWORD,
	});
};
