import fs from "fs";
import path from "path";

export const getAllFiles = (folderPath: string) => {
	let response: string[] = [];
	try {
		const allFilesAndFolders = fs.readdirSync(folderPath);

		allFilesAndFolders.forEach((file) => {
			const fullFilePath = path.join(folderPath, file).replace(/\\/g, "/");

			// ! recursive call to getAllFiles to get files inside a directory (if exists)
			if (fs.statSync(fullFilePath).isDirectory()) {
				response = response.concat(getAllFiles(fullFilePath));
			} else {
				response.push(fullFilePath);
			}
		});
	} catch (err) {
		throw new Error(`Error getting all files in folder: ${folderPath}`);
	}

	return response;
};

export const removeFolder = (folderPath: string) => {
	fs.rmSync(folderPath, { recursive: true, force: true });
};
