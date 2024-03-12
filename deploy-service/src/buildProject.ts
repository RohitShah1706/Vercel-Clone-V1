import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { Producer } from "kafkajs";

import { getAllFiles } from "./utils/file";
import { _publishLog } from "./utils/kafka";
import { decrypt } from "./utils/cryptoUtils";

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
	deployment: DeploymentType,
	producer: Producer
): Promise<boolean> => {
	console.log(`Building project ${id}`);
	await _publishLog(id, `Building project ${id}`, producer);
	try {
		if (deployment.Project.EnvVar === null) {
			console.log(`No envVars found for id: ${id}`);
			await _publishLog(id, `No envVars found for id: ${id}`, producer);
		} else {
			// console.log("build_cmd", deployment.Project.build_cmd);
			// console.log("install_cmd", deployment.Project.install_cmd);
			// console.log("root_dir", deployment.Project.root_dir);
			// console.log("out_dir", deployment.Project.out_dir);

			// ! decrypt each envVar and save to .env file inside the cloned repository
			const writeStream = fs.createWriteStream(
				path.join(__dirname, `clonedRepos/${id}/.env`),
				{ flags: "w" }
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
			await _publishLog(id, `envVars saved for id: ${id}`, producer);
		}
	} catch (error) {
		console.log(`Error writing envVars for id: ${id}`, error);
		return false;
	}

	// TODO: use docker for this step
	return new Promise(async (resolve) => {
		// add timestamp to log
		console.log(`Starting Build Process for id: ${id}`);
		await _publishLog(id, `Starting Build Process for id: ${id}`, producer);

		// __dirname = `D:/Projects/Vercel Clone/deploy-service/src/utils`
		// console.log(
		// 	"running command",
		// 	`cd ${path.join(__dirname, `clonedRepos/${id}`)}` +
		// 		`&& ${deployment.Project.install_cmd} && ${deployment.Project.build_cmd}`
		// );
		await _publishLog(
			id,
			`Running "${deployment.Project.install_cmd}" && "${deployment.Project.build_cmd}"`,
			producer
		);
		try {
			const childProcess = exec(
				`cd ${path.join(__dirname, `clonedRepos/${id}`)}` +
					`&& ${deployment.Project.install_cmd} && ${deployment.Project.build_cmd}`
			);

			// logging statements
			childProcess.stdout?.on("data", async (data) => {
				console.log("STDOUT:", data);
				await _publishLog(id, data, producer);
			});
			childProcess.stderr?.on("data", async (data) => {
				console.log("STDERR:", data);
				await _publishLog(id, data, producer);
			});

			// triggers when code is finished executing
			childProcess.on("close", async (code) => {
				// ! Refer README.md - basically html requests say 1234.js file at "/assets/1234.js"
				// However, our S3 has it as `dist/${id}/assets/1234.js`
				// we get our HTML file since we request it at proper path: {{BASE_URL}}/<id>/index.html but after that html loads files
				// so this step is to update all files to point to proper path by prefixing "/<id>" to all files
				try {
					const outDirName = deployment.Project.out_dir;
					const allFiles = getAllFiles(
						path.join(__dirname, `clonedRepos/${id}/${outDirName}`)
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
							path.join(__dirname, `clonedRepos/${id}/${outDirName}`).length
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
					console.log(`Finished building project id: ${id}`);
					await _publishLog(
						id,
						`Finished building project for id: ${id}`,
						producer
					);
					resolve(true);
				} catch (error) {
					console.log(`Error running build process for id: ${id}`, error);
					await _publishLog(
						id,
						`Error running build process for id: ${id}`,
						producer
					);
					resolve(false);
				}
			});
		} catch (error) {
			console.log(`Error running build process for id: ${id}`, error);
			await _publishLog(
				id,
				`Error running build process for id: ${id}`,
				producer
			);
			resolve(false);
		}
	});
};
