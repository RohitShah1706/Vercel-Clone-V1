import {S3Client, PutObjectCommand} from "@aws-sdk/client-s3";
import mime from "mime-types";
import fs from "fs";

import {s3Client} from "./connection/s3";
import {AWS_S3_BUCKET_NAME} from "./config";

// fileName (key to store file on S3) example => `clonedRepos/${id}/src/App.jsx`
// localFilePath (where to get file from locally) example => `D:/Projects/Vercel Clone/upload-service/src/clonedRepos/${id}/src/App.jsx`
export const uploadFile = async (fileName: string, localFilePath: string) => {
	const fileStream = fs.createReadStream(localFilePath);

	const command = new PutObjectCommand({
		Bucket: AWS_S3_BUCKET_NAME,
		Key: fileName,
		Body: fileStream,
		ContentType: mime.lookup(localFilePath) || "application/octet-stream",
	});

	const response = await s3Client.send(command);
	// console.log(response);
};
