import { getProjectById } from "@/actions/project";
import { DeploymentStatus, Project } from "@/app/types";
import { ProjectDisplay } from "../_components/project-display";
import { redirect, useRouter } from "next/navigation";

export default async function ProjectPage({
	params,
}: {
	params: { id: string };
}) {
	const project = await getProjectById(params.id);
	// const project: Project = {
	// 	id: "553b0eea-d98a-4844-9588-b4fe2e2d2274",
	// 	name: "vite_starter_template",
	// 	githubProjectName: "RohitShah1706/vite_starter_template",
	// 	user: {
	// 		email: "rlshah03@gmail.com",
	// 	},
	// 	envVars: {
	// 		VITE_BASE_URI: "",
	// 	},
	// 	rootDir: "",
	// 	outDir: "dist",
	// 	installCmd: "npm install",
	// 	buildCmd: "npm run build",
	// 	lastDeployment: {
	// 		branch: "main",
	// 		commitId: "548fabaf2b00709e012d803e0636b543e9902602",
	// 		id: "eb7bac4f-ba45-4e7a-bf57-c275b9f097cd",
	// 		status: DeploymentStatus.SUCCESS,
	// 		createdAt: new Date(),
	// 	},
	// };

	if (!project) {
		redirect("/dashboard");
	}

	return <ProjectDisplay project={project} />;
}
