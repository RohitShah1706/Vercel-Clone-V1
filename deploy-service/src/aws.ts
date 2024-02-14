import {S3} from "aws-sdk";
import fs from "fs";
import path from "path";

import {
	AWS_S3_BUCKET_NAME,
	AWS_S3_BUCKET_REGION,
	AWS_EXPRESSAPP_USER_ACCESS_KEY,
	AWS_EXPRESSAPP_USER_SECRET_ACCESS_KEY,
} from "./config";
import {getAllFiles} from "./file";

const s3 = new S3({
	endpoint: `http://localhost:4566`, // ! required for localstack
	s3ForcePathStyle: true, // ! required for localstack
	region: AWS_S3_BUCKET_REGION,
	credentials: {
		accessKeyId: AWS_EXPRESSAPP_USER_ACCESS_KEY,
		secretAccessKey: AWS_EXPRESSAPP_USER_SECRET_ACCESS_KEY,
	},
});

const uploadFile = async (fileName: string, localFilePath: string) => {
	// fileName = `dist/${id}` + `assets/index-51d1aabc.js`
	// localFilePath
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

export const copyFinalDistToS3 = async (id: string) => {
	// __dirname = `D:/Projects/Vercel Clone/deploy-service/src/`

	const folderPath = path.join(__dirname, `clonedRepos/${id}/dist`);
	const allFiles = getAllFiles(folderPath);

	const promises = allFiles.map((file) => {
		return new Promise((resolve) => {
			uploadFile(`dist/${id}/` + file.slice(folderPath.length + 1), file).then(
				() => {
					resolve("");
				}
			);
		});
	});

	console.log(`Started uploading build ${id} to S3`);
	await Promise.all(promises);
	console.log(`Finished uploading build ${id} to S3`);
};

export const downloadS3Folder = async (prefix: string) => {
	const allFiles = await s3
		.listObjectsV2({
			Bucket: AWS_S3_BUCKET_NAME,
			Prefix: prefix,
		})
		.promise();

	// console.log(allFiles);

	const allPromises =
		// ! map will create an array of promises
		allFiles.Contents?.map(async ({Key}) => {
			return new Promise(async (resolve) => {
				if (!Key) {
					resolve("");
					return;
				}

				// __dirname = `D:/Projects/Vercel Clone/deploy-service/src/`
				// Key = `clonedRepos/${id}/src/App.jsx`
				// finalOutputPath = "__dirName/Key" = `D:/Projects/Vercel Clone/deploy-service/src/clonedRepos/${id}/src/App.jsx`
				// dirName = finalOutputPath stripped of fileName = `D:/Projects/Vercel Clone/deploy-service/src/clonedRepos/${id}/src`

				const finalOutputPath = path.join(__dirname, Key);
				const dirName = path.dirname(finalOutputPath);

				if (!fs.existsSync(dirName)) {
					fs.mkdirSync(dirName, {recursive: true});
				}

				const outputFileWriteStream = fs.createWriteStream(finalOutputPath);
				s3.getObject({
					Bucket: AWS_S3_BUCKET_NAME,
					Key,
				})
					.createReadStream()
					.pipe(outputFileWriteStream)
					.on("finish", () => {
						resolve("");
					});
			});
		}) || [];

	console.log("Waiting for all files to be downloaded...");

	// ! wait for only those promises that are not undefined
	await Promise.all(allPromises?.filter((x) => x !== undefined));

	console.log("All files downloaded");
};
