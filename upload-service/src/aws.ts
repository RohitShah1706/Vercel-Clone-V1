import {S3} from "aws-sdk";
import fs from "fs";

import {
	AWS_S3_BUCKET_NAME,
	AWS_S3_BUCKET_REGION,
	AWS_EXPRESSAPP_USER_ACCESS_KEY,
	AWS_EXPRESSAPP_USER_SECRET_ACCESS_KEY,
} from "./config";

const s3 = new S3({
	endpoint: `http://localhost:4566`, // ! required for localstack
	s3ForcePathStyle: true, // ! required for localstack
	region: AWS_S3_BUCKET_REGION,
	credentials: {
		accessKeyId: AWS_EXPRESSAPP_USER_ACCESS_KEY,
		secretAccessKey: AWS_EXPRESSAPP_USER_SECRET_ACCESS_KEY,
	},
});

// fileName (key to store file on S3) example => `clonedRepos/${id}/src/App.jsx`
// localFilePath (where to get file from locally) example => `D:/Projects/Vercel Clone/upload-service/src/clonedRepos/${id}/src/App.jsx`
export const uploadFile = async (fileName: string, localFilePath: string) => {
	const fileContent = fs.readFileSync(localFilePath);

	const response = await s3
		.upload({
			Body: fileContent,
			Bucket: AWS_S3_BUCKET_NAME,
			// ! NOTE: fileName will be the key of the object in the bucket & has to be unique
			// ! since we have ${id} in the fileName it will be unique
			Key: fileName,
		})
		.promise();

	// console.log(response);
};
