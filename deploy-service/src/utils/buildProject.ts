import {exec} from "child_process";
import {PrismaClient} from "@prisma/client";
import fs from "fs";
import path, {resolve} from "path";

import {toTypedPrismaError} from "./prismaErrorMap";
import {getAllFiles} from "./file";
import {decrypt} from "./cryptoUtils";

type DeploymentType = {
	Project: {
		EnvVar: {
			key: string;
			encryptedValue: string;
		}[];
		build_cmd: string;
		install_cmd: string;
		out_dir: string;
		root_dir: string;
	};
};

export const buildProject = async (
	id: string,
	deployment: DeploymentType
): Promise<boolean> => {
	console.log(`Building project ${id}`);
	try {
		if (deployment.Project.EnvVar === null) {
			console.log(`No envVars found for id: ${id}`);
		} else {
			// console.log("build_cmd", deployment.Project.build_cmd);
			// console.log("install_cmd", deployment.Project.install_cmd);
			// console.log("root_dir", deployment.Project.root_dir);
			// console.log("out_dir", deployment.Project.out_dir);

			// ! decrypt each envVar and save to .env file inside the cloned repository
			const outputPath = path.join(__dirname, "../");
			const writeStream = fs.createWriteStream(
				path.join(outputPath, `clonedRepos/${id}/.env`),
				{flags: "w"}
			);

			deployment.Project.EnvVar.forEach((envVar) => {
				// console.log(
				// 	`writing envVar: ${envVar.key} decryptedValue: ${decrypt(
				// 		envVar.encryptedValue
				// 	)}`
				// );
				writeStream.write(`${envVar.key}=${decrypt(envVar.encryptedValue)}\n`);
			});

			writeStream.end();
			console.log(`envVars saved for id: ${id}`);
		}
	} catch (error) {
		console.log(`Error writing envVars for id: ${id}`, error);
		return false;
	}

	// TODO: use docker for this step
	return new Promise(async (resolve) => {
		console.log(`Building project ${id}`);
		// __dirname = `D:/Projects/Vercel Clone/deploy-service/src/utils`
		const outputPath = path.join(__dirname, "../");
		console.log(
			"running command",
			`cd ${path.join(outputPath, `clonedRepos/${id}`)}` +
				`&& ${deployment.Project.install_cmd} && ${deployment.Project.build_cmd}`
		);
		const childProcess = exec(
			`cd ${path.join(outputPath, `clonedRepos/${id}`)}` +
				`&& ${deployment.Project.install_cmd} && ${deployment.Project.build_cmd}`
		);

		// logging statements
		childProcess.stdout?.on("data", (data) => {
			console.log("STDOUT:", data);
		});
		childProcess.stderr?.on("data", (data) => {
			console.log("STDERR:", data);
		});

		// triggers when code is finished executing
		childProcess.on("close", async (code) => {
			// ! Refer README.md - basically html requests say 1234.js file at "/assets/1234.js"
			// However, our S3 has it as `dist/${id}/assets/1234.js`
			// we get our HTML file since we request it at proper path: {{BASE_URL}}/<id>/index.html but after that html loads files
			// so this step is to update all files to point to proper path by prefixing "/<id>" to all files
			const outDirName = deployment.Project.out_dir;
			const allFiles = getAllFiles(
				path.join(outputPath, `clonedRepos/${id}/${outDirName}`)
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
					path.join(outputPath, `clonedRepos/${id}/${outDirName}`).length
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
			console.log(`Finished building project ${id}`);
			resolve(true);
		});
	});
};
