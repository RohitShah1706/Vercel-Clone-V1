import dotenv from "dotenv";
dotenv.config();

const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "";
const AWS_S3_BASE_URL = process.env.AWS_S3_BASE_URL || "";

export {AWS_S3_BUCKET_NAME, AWS_S3_BASE_URL};
