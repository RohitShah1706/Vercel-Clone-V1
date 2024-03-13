import { getProjectById } from "@/actions/project";
import { Deployment, DeploymentStatus, Project } from "@/app/types";
import { ProjectDisplay } from "../_components/project-display";
import { redirect, useRouter } from "next/navigation";
import { getDeployments } from "@/actions/deployment";

export default async function ProjectPage({
	params,
}: {
	params: { id: string };
}) {
	const project = await getProjectById(params.id);
	// console.log(project);
	// const project: Project = {
	// 	id: "553b0eea-d98a-4844-9588-b4fe2e2d2274",
	// 	name: "vite_starter_template",
	// 	githubProjectName: "RohitShah1706/vite_starter_template",
	// 	user: { email: "rlshah03@gmail.com" },
	// 	envVars: { VITE_BASE_URI: "" },
	// 	lastDeployment: {
	// 		id: "899b4801-eb23-4294-abd3-6db274b9de7d",
	// 		status: DeploymentStatus.SUCCESS,
	// 		branch: "main",
	// 		commitId: "548fabaf2b00709e012d803e0636b543e9902602",
	// 		createdAt: new Date("2024-03-12T06:58:50.920Z"),
	// 	},
	// 	rootDir: "",
	// 	outDir: "dist",
	// 	installCmd: "npm install",
	// 	buildCmd: "npm run build",
	// };

	const deployments = await getDeployments(params.id);
	// console.log(deployments);
	// const deployments: Deployment[] = [
	// 	{
	// 		id: "899b4801-eb23-4294-abd3-6db274b9de7d",
	// 		branch: "main",
	// 		commitId: "548fabaf2b00709e012d803e0636b543e9902602",
	// 		status: DeploymentStatus.SUCCESS,
	// 		createdAt: new Date("2024-03-12T06:58:50.920Z"),
	// 		githubProjectName: "RohitShah1706/vite_starter_template",
	// 		isActive: true,
	// 	},
	// 	{
	// 		id: "b75111b0-e9aa-46a0-b3db-2b0667ed0ff9",
	// 		branch: "main",
	// 		commitId: "548fabaf2b00709e012d803e0636b543e9902602",
	// 		status: DeploymentStatus.FAILED,
	// 		createdAt: new Date("2024-03-12T06:57:04.841Z"),
	// 		githubProjectName: "RohitShah1706/vite_starter_template",
	// 		isActive: false,
	// 	},
	// ];

	if (!project) {
		redirect("/dashboard");
	}

	return <ProjectDisplay project={project} deployments={deployments} />;
}
