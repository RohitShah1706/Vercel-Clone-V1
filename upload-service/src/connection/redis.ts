import {createClient} from "redis";

export const getRedisClient = ({
	REDIS_HOST,
	REDIS_PASSWORD,
	REDIS_PORT,
	REDIS_SECURE,
}: {
	REDIS_HOST: string;
	REDIS_PASSWORD: string;
	REDIS_PORT: string;
	REDIS_SECURE: string;
}) => {
	const protocol = REDIS_SECURE === "true" ? "rediss" : "redis";
	console.log("REDIS_SECURE", REDIS_SECURE);
	return createClient({
		url: `${protocol}://${REDIS_HOST}:${REDIS_PORT}`,
		password: REDIS_PASSWORD,
	});
};
