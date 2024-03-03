"use client";

import { ColumnDef } from "@tanstack/react-table";
import { formatRelative } from "date-fns";
import { GitBranch } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// function UserCell({ userId }: { userId: Id<"users"> }) {
// 	const userProfile = useQuery(api.users.getUserProfile, {
// 		userId: userId,
// 	});
// 	return (
// 		<div className="flex gap-2 text-xs text-gray-700 w-40 items-center">
// 			<Avatar className="w-6 h-6">
// 				<AvatarImage src={userProfile?.image} />
// 				<AvatarFallback>CN</AvatarFallback>
// 			</Avatar>
// 			{userProfile?.name}
// 		</div>
// 	);
// }

export enum DeploymentStatus {
	QUEUED = "QUEUED",
	DEPLOYING = "DEPLOYING",
	SUCCESS = "SUCCESS",
	FAILED = "FAILED",
}

export interface Project {
	id: string;
	name: string;
	buildCmd: string | null;
	installCmd: string | null;
	outDir: string | null;
	rootDir: string | null;
	githubProjectName: string;
	lastDeployment: {
		id: string;
		branch: string;
		commitId: string;
		status: DeploymentStatus;
		createdAt: Date;
	} | null;
	envVars:
		| {
				key: string;
				value: string;
		  }[]
		| null;
	user: {
		email: string;
	} | null;
}

export const columns: ColumnDef<Project>[] = [
	{
		header: "Name",
		cell: ({ row }) => {
			return (
				<div className="flex flex-col gap-1">
					<Link
						className="overflow-auto whitespace-normal font-semibold underline"
						href={`/dashboard/projects/${row.original.id}`}
					>
						{row.original.name}
					</Link>
					<Link
						href={`${process.env.NEXT_PUBLIC_PROXY_SERVER_BASE_URL}/${row.original.id}/`}
						className="overflow-auto whitespace-normal underline text-gray-600 dark:text-gray-300"
						target="_blank"
					>
						{row.original.id}
					</Link>
				</div>
			);
		},
	},
	{
		header: "Deployment",
		cell: ({ row }) => {
			return (
				<div className="flex flex-col gap-2">
					<Link
						href={`https://github.com/${row.original.githubProjectName}/tree/${row.original.lastDeployment?.commitId}`}
						className="overflow-auto whitespace-normal flex items-center gap-2 bg-[#FAFBFB] dark:bg-gray-950 rounded-md px-3 py-1 font-semibold w-max"
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
						{row.original.githubProjectName}
					</Link>
					<div>
						{row.original.lastDeployment &&
							formatRelative(
								new Date(row.original.lastDeployment.createdAt),
								new Date()
							)}
						<div className="flex items-center gap-2">
							{`on ${row.original.lastDeployment?.branch}`}
							<GitBranch className="w-4 h-4 md:w-5 md:h-5" />
						</div>
					</div>
				</div>
			);
		},
	},
];
