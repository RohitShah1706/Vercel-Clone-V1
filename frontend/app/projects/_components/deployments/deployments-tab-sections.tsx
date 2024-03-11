import { Card, CardContent } from "@/components/ui/card";

import Link from "next/link";
import { GitBranch, GitCommitHorizontal, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

import { DeploymentStatus, Project } from "@/app/types";
import Image from "next/image";

export const DeploymentsTabSection = ({ project }: { project: Project }) => {
	return (
		<section className="container mt-12 flex flex-col gap-8">
			<div>
				<h1 className="text-2xl font-semibold">Deployments</h1>
				<p className="text-sm text-[#666666] dark:text-[#A1A1A1] mt-2 flex items-center gap-2">
					<RefreshCw className="w-4 h-4" />
					Continuously generated from
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
			</div>
			<div>
				now show list of deployments and on clicking show more details about
				deployment
			</div>
		</section>
	);
};
