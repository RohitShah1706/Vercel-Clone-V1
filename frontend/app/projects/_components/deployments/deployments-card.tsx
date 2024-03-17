import { Card, CardContent } from "@/components/ui/card";
import { Deployment, DeploymentStatus } from "@/types";
import Link from "next/link";
import { GitBranch, GitCommitHorizontal } from "lucide-react";
import { formatRelative } from "date-fns";
import { DisplayDeploymentStatus } from "@/components/custom/display-deployment-status";

export const DeploymentsCard = ({ deployment }: { deployment: Deployment }) => {
	return (
		<Card className="rounded-lg mb-4">
			<CardContent className="flex flex-col gap-4 px-4 py-4">
				<div className="flex flex-col gap-1">
					<Link
						href={`/deployments/${deployment.id}/`}
						className="overflow-auto whitespace-normal text-sm font-[600] underline"
					>
						{deployment.id.slice(0, 8)}
					</Link>
					<p className="text-sm text-muted-foreground">
						{deployment.isActive ? "Active" : "Deployed"}
					</p>
				</div>
				<hr className="border-t" />
				<div>
					<DisplayDeploymentStatus deploymentStatus={deployment.status} />
				</div>
				<hr className="border-t" />
				<div className="flex flex-col gap-1">
					<p className="flex items-center gap-2 text-sm">
						<GitBranch className="w-4 h-4" />
						<Link
							href={`https://github.com/${deployment.githubProjectName}/tree/${deployment.branch}`}
							target="_blank"
							className="underline"
						>
							{deployment.branch}
						</Link>
					</p>
					<p className="flex items-center gap-2 text-sm">
						<GitCommitHorizontal className="w-4 h-4" />
						<Link
							href={`https://github.com/${deployment.githubProjectName}/tree/${deployment.commitId}`}
							target="_blank"
							className="underline"
						>
							{deployment.commitId.slice(0, 7)}
						</Link>
					</p>
				</div>
				<hr className="border-t" />
				<p className="text-sm">
					{formatRelative(new Date(deployment.createdAt), new Date())}
				</p>
			</CardContent>
		</Card>
	);
};
