import { DeploymentStatus } from "@/types";

export const DisplayDeploymentStatus = ({
	deploymentStatus,
}: {
	deploymentStatus: DeploymentStatus;
}) => {
	return deploymentStatus === DeploymentStatus.FAILED ? (
		<p className="text-sm font-[500] flex items-center gap-2">
			<span className="inline-block h-3 w-3 rounded-full bg-[#f87171]"></span>
			{deploymentStatus}
		</p>
	) : deploymentStatus === DeploymentStatus.DEPLOYING ||
	  deploymentStatus === DeploymentStatus.QUEUED ? (
		<p className="text-sm font-[500] flex items-center gap-2">
			<span className="inline-block h-3 w-3 rounded-full bg-[#f6bc3f]"></span>
			{deploymentStatus}
		</p>
	) : (
		<p className="text-sm font-[500] flex items-center gap-2">
			<span className="inline-block h-3 w-3 rounded-full bg-[#50e3c2]"></span>
			{deploymentStatus}
		</p>
	);
};
