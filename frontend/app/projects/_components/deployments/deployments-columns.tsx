"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { Deployment, DeploymentStatus } from "@/app/types";
import { GitBranch, GitCommitHorizontal } from "lucide-react";
import { formatRelative } from "date-fns";

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
			return row.original.status === DeploymentStatus.FAILED ? (
				<p className="text-sm font-[500] flex items-center gap-2">
					<span className="inline-block h-3 w-3 rounded-full bg-[#f87171]"></span>
					{row.original.status}
				</p>
			) : row.original.status === DeploymentStatus.DEPLOYING ||
			  row.original.status === DeploymentStatus.QUEUED ? (
				<p className="text-sm font-[500] flex items-center gap-2">
					<span className="inline-block h-3 w-3 rounded-full bg-[#f6bc3f]"></span>
					{row.original.status}
				</p>
			) : (
				<p className="text-sm font-[500] flex items-center gap-2">
					<span className="inline-block h-3 w-3 rounded-full bg-[#50e3c2]"></span>
					{row.original.status}
				</p>
			);
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
