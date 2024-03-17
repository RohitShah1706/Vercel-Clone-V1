"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { Deployment, DeploymentStatus } from "@/types";
import { GitBranch, GitCommitHorizontal } from "lucide-react";
import { formatRelative } from "date-fns";
import { DisplayDeploymentStatus } from "@/components/custom/display-deployment-status";

export const deploymentColumns: ColumnDef<Deployment>[] = [
	{
		header: "Id",
		cell: ({ row }) => {
			return (
				<div className="flex flex-col gap-1">
					<Link
						href={`/deployments/${row.original.id}/`}
						className="overflow-auto whitespace-normal font-semibold hover:underline"
					>
						{row.original.id.slice(0, 8)}
					</Link>
					<p>{row.original.isActive ? "Active" : "Deployed"}</p>
				</div>
			);
		},
	},
	{
		header: "Status",
		cell: ({ row }) => {
			return <DisplayDeploymentStatus deploymentStatus={row.original.status} />;
		},
	},
	{
		header: "Source",
		cell: ({ row }) => {
			return (
				<div className="flex flex-col gap-1">
					<p className="flex items-center gap-2 text-sm">
						<GitBranch className="w-4 h-4" />
						<Link
							href={`https://github.com/${row.original.githubProjectName}/tree/${row.original.branch}`}
							target="_blank"
							className="hover:underline"
						>
							{row.original.branch}
						</Link>
					</p>
					<p className="flex items-center gap-2 text-sm">
						<GitCommitHorizontal className="w-4 h-4" />
						<Link
							href={`https://github.com/${row.original.githubProjectName}/tree/${row.original.commitId}`}
							target="_blank"
							className="hover:underline"
						>
							{row.original.commitId.slice(0, 7)}
						</Link>
					</p>
				</div>
			);
		},
	},
	{
		header: "Last Deployed",
		cell: ({ row }) => {
			return (
				<p className="text-sm">
					{formatRelative(new Date(row.original.createdAt), new Date())}
				</p>
			);
		},
	},
];
