import dotenv from "dotenv";
dotenv.config();

const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "";

export {AWS_S3_BUCKET_NAME};
