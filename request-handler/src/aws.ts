import {S3} from "aws-sdk";

import {
	AWS_S3_BUCKET_NAME,
	AWS_S3_BUCKET_REGION,
	AWS_EXPRESSAPP_USER_ACCESS_KEY,
	AWS_EXPRESSAPP_USER_SECRET_ACCESS_KEY,
} from "./config";

const s3 = new S3({
	region: AWS_S3_BUCKET_REGION,
	credentials: {
		accessKeyId: AWS_EXPRESSAPP_USER_ACCESS_KEY,
		secretAccessKey: AWS_EXPRESSAPP_USER_SECRET_ACCESS_KEY,
	},
});

export const getObject = async (key: string) => {
	console.log("Requesting file from S3", key);
	try {
		const contents = await s3
			.getObject({
				Bucket: AWS_S3_BUCKET_NAME,
				Key: key,
			})
			.promise();
		return contents.Body;
	} catch (err) {
		console.error("Error getting object from S3");
		return null;
	}
};
