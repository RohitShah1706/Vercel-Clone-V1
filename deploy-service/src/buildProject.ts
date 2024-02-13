import {exec} from "child_process";
import fs from "fs";
import path from "path";

import {getAllFiles} from "./file";

export const buildProject = (id: string) => {
	console.log(`Building project ${id}`);
	// TODO: use docker for this step
	return new Promise((resolve) => {
		// __dirname = `D:/Projects/Vercel Clone/deploy-service/src/`
		const childProcess = exec(
			`cd ${path.join(__dirname, `clonedRepos/${id}`)}` +
				`&& npm install && npm run build`
		);

		// logging statements
		childProcess.stdout?.on("data", (data) => {
			console.log("STDOUT:", data);
		});
		childProcess.stderr?.on("data", (data) => {
			console.log("STDERR:", data);
		});

		// triggers when code is finished executing
		childProcess.on("close", (code) => {
			console.log(`Project ${id} Built successfully`);

			// ! Refer README.md - basically we html request say 1234.js file at "/assets/1234.js"
			// However, our S3 has it as `dist/${id}/assets/1234.js`
			// we get our HTML file since we request it at proper path: {{BASE_URL}}/<id>/index.html but after that html loads files
			// so this step is to update all files to point to proper path by prefixing "/<id>" to all files
			const allFiles = getAllFiles(
				path.join(__dirname, `clonedRepos/${id}/dist`)
			);

			const toUpdate: string[] = allFiles.filter((file) => {
				const fileType = file.split(".").pop();
				return (
					fileType === "jpg" ||
					fileType === "jpeg" ||
					fileType === "png" ||
					fileType === "svg" ||
					fileType == "gif" ||
					fileType == "js" ||
					fileType == "css"
				);
			});

			toUpdate.forEach((file) => {
				const keyToSearch = file.slice(
					path.join(__dirname, `clonedRepos/${id}/dist`).length
				);
				allFiles.forEach((file) => {
					const fileType = file.split(".").pop();
					if (fileType === "html" || fileType === "js") {
						let fileContent = fs.readFileSync(file, "utf-8");
						fileContent = fileContent.replace(
							keyToSearch,
							`/${id}${keyToSearch}`
						);
						fs.writeFileSync(file, fileContent);
					}
				});
			});

			resolve("");
		});
	});
};
