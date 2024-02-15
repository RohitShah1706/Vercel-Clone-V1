import {GetObjectCommand} from "@aws-sdk/client-s3";
import {createWriteStream} from "fs";

import {s3Client} from "./connection/s3";

const oneMB = 1024 * 1024;

export const getObjectRange = ({
	bucket,
	key,
	start,
	end,
}: {
	bucket: string;
	key: string;
	start: number;
	end: number;
}) => {
	const command = new GetObjectCommand({
		Bucket: bucket,
		Key: key,
		Range: `bytes=${start}-${end}`,
	});

	return s3Client.send(command);
};

export const getRangeAndLength = (contentRange: string) => {
	const [range, length] = contentRange.split("/");
	const [start, end] = range.split("-");
	return {
		start: parseInt(start),
		end: parseInt(end),
		length: parseInt(length),
	};
};

export const isComplete = ({end, length}: {end: number; length: number}) =>
	end === length - 1;

// ! When downloading a large file, we might want to break it down into smaller pieces
// ! Amazon S3 accepts a Range header to specify the start
// ! and end of the byte range to be downloaded.
const _downloadInChunks = async ({
	bucket,
	key,
	localFilePath,
}: {
	bucket: string;
	key: string;
	localFilePath: string;
}) => {
	const writeStream = createWriteStream(localFilePath).on("error", (err) =>
		console.error(err)
	);

	let rangeAndLength = {start: -1, end: -1, length: -1};

	while (!isComplete(rangeAndLength)) {
		const {end} = rangeAndLength;
		const nextRange = {start: end + 1, end: end + oneMB};

		// console.log(
		// 	`Key: ${key}\nDownloading bytes for ${nextRange.start} to ${nextRange.end}`
		// );

		const {ContentRange, Body} = await getObjectRange({
			bucket,
			key,
			...nextRange,
		});

		if (ContentRange === undefined || Body === undefined) {
			throw new Error("ContentRange or Body is undefined");
		}

		writeStream.write(await Body?.transformToByteArray());
		rangeAndLength = getRangeAndLength(ContentRange);
		writeStream.end();
	}
};

export const downloadInChunks = async ({
	bucket,
	key,
	localFilePath,
}: {
	bucket: string;
	key: string;
	localFilePath: string;
}) => {
	return _downloadInChunks({bucket, key, localFilePath});
};
