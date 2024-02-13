import {exec, spawn} from "child_process";
import path from "path";

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
			resolve("");
		});
	});
};
