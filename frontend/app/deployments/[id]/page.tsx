import { Deployment, DeploymentStatus } from "@/app/types";
import { DeploymentInfoDisplay } from "../_components/deployment-info-display";
import { getDeploymentInfo } from "@/actions/deployment";
import { redirect } from "next/navigation";

export default async function DeploymentInfoPage({
	params,
}: {
	params: { id: string };
}) {
	const deploymentInfo = await getDeploymentInfo(params.id);

	// const deploymentInfo: Deployment = {
	// 	id: "899b4801-eb23-4294-abd3-6db274b9de7d",
	// 	branch: "main",
	// 	commitId: "548fabaf2b00709e012d803e0636b543e9902602",
	// 	status: DeploymentStatus.SUCCESS,
	// 	createdAt: new Date("2024-03-12T06:58:50.920Z"),
	// 	projectId: "553b0eea-d98a-4844-9588-b4fe2e2d2274",
	// 	logEvent: [
	// 		{
	// 			log: "Building project 899b4801-eb23-4294-abd3-6db274b9de7d",
	// 		},
	// 		{
	// 			log: "envVars saved for id: 899b4801-eb23-4294-abd3-6db274b9de7d",
	// 		},
	// 		{
	// 			log: "Starting Build Process for id: 899b4801-eb23-4294-abd3-6db274b9de7d",
	// 		},
	// 		{
	// 			log: 'Running "npm install" && "npm run build"',
	// 		},
	// 		{
	// 			log: "\nadded 272 packages, and audited 273 packages in 4s\n",
	// 		},
	// 		{
	// 			log: "\n98 packages are looking for funding\n  run `npm fund` for details\n",
	// 		},
	// 		{
	// 			log: "\nfound 0 vulnerabilities\n",
	// 		},
	// 		{
	// 			log: "\n> vite-project@0.0.0 build\n> vite build\n\n",
	// 		},
	// 		{
	// 			log: "vite v5.1.2 building for production...\n",
	// 		},
	// 		{
	// 			log: "transforming...\n",
	// 		},
	// 		{
	// 			log: "✓ 34 modules transformed.\n",
	// 		},
	// 		{
	// 			log: "rendering chunks...\n",
	// 		},
	// 		{
	// 			log: "computing gzip size...\n",
	// 		},
	// 		{
	// 			log: "dist/index.html                   0.47 kB │ gzip:  0.30 kB\n",
	// 		},
	// 		{
	// 			log: "dist/assets/react-CHdo91hT.svg    4.13 kB │ gzip:  2.05 kB\ndist/assets/index-DiwrgTda.css    1.39 kB │ gzip:  0.72 kB\ndist/assets/index-Cut9hnE5.js   143.81 kB │ gzip: 46.30 kB\n✓ built in 771ms\n",
	// 		},
	// 		{
	// 			log: "Finished building project for id: 899b4801-eb23-4294-abd3-6db274b9de7d",
	// 		},
	// 		{
	// 			log: "Started uploading build 899b4801-eb23-4294-abd3-6db274b9de7d to S3",
	// 		},
	// 		{
	// 			log: "Finished uploading build 899b4801-eb23-4294-abd3-6db274b9de7d to S3",
	// 		},
	// 	],
	// 	githubProjectName: "RohitShah1706/vite_starter_template",
	// };

	if (deploymentInfo === null) {
		redirect("/dashboard");
	}

	return <DeploymentInfoDisplay deploymentInfo={deploymentInfo} />;
}
