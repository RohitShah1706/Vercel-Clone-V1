import dotenv from "dotenv";
dotenv.config();

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "";
const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "";
const AWS_S3_BUCKET_REGION = process.env.AWS_S3_BUCKET_REGION || "";
const AWS_EXPRESSAPP_USER_ACCESS_KEY =
	process.env.AWS_EXPRESSAPP_USER_ACCESS_KEY || "";
const AWS_EXPRESSAPP_USER_SECRET_ACCESS_KEY =
	process.env.AWS_EXPRESSAPP_USER_SECRET_ACCESS_KEY || "";
const REDIS_HOST = process.env.REDIS_HOST || "redis";
const REDIS_PORT = process.env.REDIS_PORT || "6379";
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || "mypassword";
const REDIS_SECURE = process.env.REDIS_SECURE || "false";
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";

export {
	ENCRYPTION_KEY,
	AWS_S3_BUCKET_NAME,
	AWS_S3_BUCKET_REGION,
	AWS_EXPRESSAPP_USER_ACCESS_KEY,
	AWS_EXPRESSAPP_USER_SECRET_ACCESS_KEY,
	REDIS_HOST,
	REDIS_PORT,
	REDIS_SECURE,
	REDIS_PASSWORD,
	MONGO_URI,
};
