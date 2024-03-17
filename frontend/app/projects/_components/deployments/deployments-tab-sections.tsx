"use client";

import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { Deployment, Project } from "@/types";
import Image from "next/image";
import { DeploymentsTable } from "./deployments-table";
import { deploymentColumns } from "./deployments-columns";
import { DeploymentsCard } from "./deployments-card";
import { NewDeploymentInput } from "./new-deployment-input";

export const DeploymentsTabSection = ({
	project,
	deployments,
}: {
	project: Project;
	deployments: Deployment[];
}) => {
	return (
		<section className="container mt-12 flex flex-col gap-8">
			<div>
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-semibold">Deployments</h1>
					<NewDeploymentInput project={project} />
				</div>
				<p className="text-sm text-[#666666] dark:text-[#A1A1A1] mt-2 flex flex-col sm:flex-row gap-2">
					<p className="flex items-center gap-2">
						<RefreshCw className="w-4 h-4" />
						Continuously generated from
					</p>
					<p className="flex items-center gap-2">
						<span>
							<Image
								src="/github.svg"
								alt="github"
								width={16}
								height={16}
								className="block dark:hidden"
							/>
							<Image
								src="/github-white.svg"
								alt="github"
								width={16}
								height={16}
								className="hidden dark:block"
							/>
						</span>
						<Link
							href={`https://github.com/${project.githubProjectName}/tree/${project.lastDeployment?.branch}`}
							target="_blank"
							className="hover:underline"
						>
							{project.githubProjectName}
						</Link>
					</p>
				</p>
			</div>

			<div className="hidden sm:block">
				<DeploymentsTable columns={deploymentColumns} data={deployments} />
			</div>

			<div className="flex flex-col sm:hidden gap-4 p-1">
				{deployments.map((deployment) => (
					<DeploymentsCard deployment={deployment} key={deployment.id} />
				))}
			</div>
		</section>
	);
};
