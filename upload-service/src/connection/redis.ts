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
	console.log("REDIS_HOST", REDIS_HOST);
	console.log("REDIS_PORT", REDIS_PORT);
	console.log("REDIS_PASSWORD", REDIS_PASSWORD);
	console.log("REDIS_SECURE", REDIS_SECURE);
	const protocol = REDIS_SECURE === "true" ? "rediss" : "redis";
	console.log("REDIS_SECURE", REDIS_SECURE);
	return createClient({
		url: `${protocol}://${REDIS_HOST}:${REDIS_PORT}`,
		password: REDIS_PASSWORD,
	});
};
