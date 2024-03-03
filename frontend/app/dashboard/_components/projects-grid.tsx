import Link from "next/link";
import { Project } from "./project-columns";
import { GitBranch } from "lucide-react";
import { formatRelative } from "date-fns";
import Image from "next/image";

export const ProjectsGrid = ({ projects }: { projects: Project[] }) => {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
			{projects.map((project, index) => (
				<div
					key={index}
					className="border rounded-lg p-4 flex flex-col gap-4 bg-[#FEFFFE] dark:bg-[#0B0B0A]"
				>
					<div className="flex flex-col gap-1">
						<Link
							className="overflow-auto whitespace-normal font-semibold underline text-base md:text-lg"
							href={`/dashboard/projects/${project.id}`}
						>
							{project.name}
						</Link>
						<Link
							href={`${process.env.NEXT_PUBLIC_PROXY_SERVER_BASE_URL}/${project.id}/`}
							className="overflow-auto whitespace-normal underline text-sm md:text-base text-gray-600 dark:text-gray-300"
							target="_blank"
						>
							{project.id}
						</Link>
					</div>

					<div className="flex flex-col gap-4 overflow-auto whitespace-normal">
						<Link
							href={`https://github.com/${project.githubProjectName}/tree/${project.lastDeployment?.commitId}`}
							className="flex items-center gap-2 bg-[#FAFBFB] dark:bg-gray-950 rounded-lg px-3 py-1 font-semibold w-max text-sm md:text-base"
							target="_blank"
						>
							<div className="block dark:hidden">
								<Image src="/github.svg" alt="github" width={20} height={20} />
							</div>
							<div className="hidden dark:block">
								<Image
									src="/github-white.svg"
									alt="github"
									width={20}
									height={20}
								/>
							</div>
							{project.githubProjectName}
						</Link>
						<div className="text-sm md:text-base">
							{project.lastDeployment &&
								formatRelative(
									new Date(project.lastDeployment.createdAt),
									new Date()
								)}
							<div className="flex items-center gap-2">
								{`on ${project.lastDeployment?.branch}`}
								<GitBranch className="w-4 h-4 md:w-5 md:h-5" />
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};
