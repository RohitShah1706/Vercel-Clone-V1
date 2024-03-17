import { Card, CardContent } from "@/components/ui/card";

import { DeploymentStatus, Project } from "@/types";
import Link from "next/link";
import { GitBranch, GitCommitHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DisplayDeploymentStatus } from "@/components/custom/display-deployment-status";

export const ProjectTabSection = ({ project }: { project: Project }) => {
	return (
		<section className="container mt-12 flex flex-col gap-8">
			<div>
				<h1 className="text-2xl font-semibold">Production Deployment</h1>
				<p className="text-sm text-[#666666] dark:text-[#A1A1A1] mt-2">
					The deployment that is available to your visitors.
				</p>
			</div>
			<Card className="rounded-lg">
				<CardContent className="p-4 flex flex-col gap-4">
					<div className="flex flex-col gap-1">
						<p className="text-sm text-[#666666] dark:text-[#A1A1A1]">
							Deployment
						</p>
						<Link
							href={`${process.env.NEXT_PUBLIC_PROXY_SERVER_BASE_URL}/${project.id}/`}
							target="_blank"
							className="hover:underline font-[500]"
						>
							{`${process.env.NEXT_PUBLIC_PROXY_SERVER_BASE_URL}/${project.id}/`}
						</Link>
					</div>

					<div className="flex flex-col gap-1">
						<p className="text-sm text-[#666666] dark:text-[#A1A1A1]">Status</p>
						{project.lastDeployment ? (
							<DisplayDeploymentStatus
								deploymentStatus={project.lastDeployment.status}
							/>
						) : (
							<p>No deployments</p>
						)}
					</div>

					{project.lastDeployment && (
						<div className="flex flex-col gap-2">
							<p className="text-sm text-[#666666] dark:text-[#A1A1A1]">
								Source
							</p>
							<p className="flex items-center gap-2 text-sm text-[#666666] dark:text-[#A1A1A1]">
								<GitBranch className="w-4 h-4" />
								<Link
									href={`https://github.com/${project.githubProjectName}/tree/${project.lastDeployment.branch}`}
									target="_blank"
									className="hover:underline"
								>
									{project.lastDeployment.branch}
								</Link>
							</p>
							<p className="flex items-center gap-2 text-sm text-[#666666] dark:text-[#A1A1A1]">
								<GitCommitHorizontal className="w-4 h-4" />
								<Link
									href={`https://github.com/${project.githubProjectName}/tree/${project.lastDeployment.commitId}`}
									target="_blank"
									className="hover:underline"
								>
									{project.lastDeployment.commitId.slice(0, 7)}
								</Link>
							</p>
						</div>
					)}
				</CardContent>
			</Card>

			<Card className="rounded-lg">
				<CardContent className="py-4 flex flex-col gap-4">
					<div className="flex justify-between items-center">
						<p className="text-sm text-[#666666] dark:text-[#A1A1A1]">{`To update your Production Deployment, push to the "main" branch.`}</p>
						<Link
							href="https://vercel.com/docs/deployments/git#production-branch"
							target="_blank"
						>
							<Button variant="outline" className="hidden md:block">
								Learn More
							</Button>
						</Link>
					</div>
					<Link
						href="https://vercel.com/docs/deployments/git#production-branch"
						target="_blank"
						className="w-full block md:hidden"
					>
						<Button variant="outline" className="w-full">
							Learn More
						</Button>
					</Link>
				</CardContent>
			</Card>
		</section>
	);
};
