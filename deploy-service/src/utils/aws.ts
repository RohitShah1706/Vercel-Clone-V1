import {
	PutObjectCommand,
	paginateListObjectsV2,
	_Object,
} from "@aws-sdk/client-s3";
import mime from "mime-types";
import fs from "fs";
import path from "path";

import {s3Client} from "../connection/s3";
import {AWS_S3_BUCKET_NAME} from "../config";
import {getAllFiles} from "./file";
import {downloadInChunks} from "./downloadInChunks";

const uploadFile = async (fileName: string, localFilePath: string) => {
	// fileName = `dist/${id}` + `assets/index-51d1aabc.js`

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

export const copyFinalDistToS3 = async (id: string, outDir: string) => {
	// __dirname = `D:/Projects/Vercel Clone/deploy-service/src/utils`
	const outputPath = path.join(__dirname, "../");
	const folderPath = path.join(outputPath, `clonedRepos/${id}/${outDir}`);
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
	const commandInput = {
		Bucket: AWS_S3_BUCKET_NAME,
		Prefix: prefix,
	};

	const paginatorConfig = {
		client: s3Client,
		pageSize: 1000,
		startingToken: null,
	};

	const paginator = paginateListObjectsV2(paginatorConfig, commandInput);

	let allFiles: string[] = [];

	for await (const page of paginator) {
		for (const object of page.Contents || []) {
			if (object.Key) {
				allFiles.push(object.Key);
			}
		}
	}

	const outputPath = path.join(__dirname, "../");

	const downloadPromises = allFiles.map(async (Key) => {
		if (!Key) {
			return;
		}

		const finalOutputPath = path.join(outputPath, Key);
		const dirName = path.dirname(finalOutputPath);

		if (!fs.existsSync(dirName)) {
			fs.mkdirSync(dirName, {recursive: true});
		}

		await downloadInChunks({
			bucket: AWS_S3_BUCKET_NAME,
			key: Key,
			localFilePath: finalOutputPath,
		});

		// console.log(`Downloaded ${Key}`);
		return Key;
	});

	console.log("Waiting for all files to be downloaded...");
	await Promise.all(downloadPromises);

	console.log("All files downloaded");
};
