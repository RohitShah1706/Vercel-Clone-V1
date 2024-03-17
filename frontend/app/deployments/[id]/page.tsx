import { DeploymentInfoDisplay } from "../_components/deployment-info-display";
import { getDeploymentInfo } from "@/actions/deployment";
import { redirect } from "next/navigation";

export default async function DeploymentInfoPage({
	params,
}: {
	params: { id: string };
}) {
	const deploymentInfo = await getDeploymentInfo(params.id);

	if (deploymentInfo === null) {
		redirect("/dashboard");
	}

	return <DeploymentInfoDisplay deploymentInfo={deploymentInfo} />;
}
