import { getProjectById } from "@/actions/project";
import { Deployment, DeploymentStatus, Project } from "@/types";
import { ProjectDisplay } from "../_components/project-display";
import { redirect, useRouter } from "next/navigation";
import { getDeployments } from "@/actions/deployment";

export default async function ProjectPage({
	params,
}: {
	params: { id: string };
}) {
	const project = await getProjectById(params.id);

	const deployments = await getDeployments(params.id);

	if (!project) {
		redirect("/dashboard");
	}

	return <ProjectDisplay project={project} deployments={deployments} />;
}
