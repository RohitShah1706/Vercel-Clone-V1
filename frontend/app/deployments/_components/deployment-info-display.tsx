"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatRelative } from "date-fns";
import { Check, GitBranch, GitCommitHorizontal, Globe } from "lucide-react";
import Link from "next/link";
import { Deployment, DeploymentStatus } from "@/types";
import { Spinner } from "@/components/custom/spinner";
import { useEffect, useRef, useState } from "react";
import { getDeploymentStatus } from "@/actions/deployment";
import { getDeploymentLogs } from "@/actions/logs";
import { DisplayDeploymentStatus } from "@/components/custom/display-deployment-status";

export const DeploymentInfoDisplay = ({
	deploymentInfo,
}: {
	deploymentInfo: Deployment;
}) => {
	const [displayDeploymentInfo, setDisplayDeploymentInfo] =
		useState<Deployment>(deploymentInfo);

	const lastLogRef = useRef<HTMLParagraphElement>(null);

	useEffect(() => {
		lastLogRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [displayDeploymentInfo.logEvent]);

	const intervalIds = useRef<NodeJS.Timeout[]>([]);
	useEffect(() => {
		if (
			displayDeploymentInfo.status === DeploymentStatus.DEPLOYING ||
			displayDeploymentInfo.status === DeploymentStatus.QUEUED
		) {
			intervalIds.current.push(
				setInterval(async () => {
					const updatedDeploymentStatus = await getDeploymentStatus(
						displayDeploymentInfo.id
					);

					setDisplayDeploymentInfo((prev) => ({
						...prev,
						status: updatedDeploymentStatus,
					}));
				}, 3000),

				setInterval(async () => {
					const updatedDeploymentLogs = await getDeploymentLogs(
						displayDeploymentInfo.id
					);

					setDisplayDeploymentInfo((prev) => ({
						...prev,
						logEvent: updatedDeploymentLogs,
					}));

					lastLogRef.current?.scrollIntoView({ behavior: "smooth" });
				}, 3000)
			);
		}

		return () => {
			intervalIds.current.forEach(clearInterval);
			intervalIds.current = [];
		};
	}, [displayDeploymentInfo.status, displayDeploymentInfo.id]);

	return (
		<div className="px-6 sm:container flex flex-col gap-6 mt-14">
			<div className="flex items-center justify-between">
				<div className="flex flex-col gap-1">
					<p className="text-sm text-[#666666] dark:text-[#A1A1A1]">Status</p>
					<DisplayDeploymentStatus deploymentStatus={deploymentInfo.status} />
				</div>
				<div className="flex flex-col gap-1">
					<p className="text-sm text-[#666666] dark:text-[#A1A1A1]">
						Last Deployed
					</p>
					<p className="text-sm">
						{formatRelative(
							new Date(displayDeploymentInfo.createdAt),
							new Date()
						)}
					</p>
				</div>
				<Link
					href={`${process.env.NEXT_PUBLIC_PROXY_SERVER_BASE_URL}/${displayDeploymentInfo.projectId}/`}
					target="_blank"
					className="w-[222px] hidden sm:block"
				>
					<Button className="w-full">Visit</Button>
				</Link>
			</div>
			<Link
				href={`${process.env.NEXT_PUBLIC_PROXY_SERVER_BASE_URL}/${displayDeploymentInfo.projectId}/`}
				target="_blank"
				className="w-full block sm:hidden"
			>
				<Button className="w-full">Visit</Button>
			</Link>
			<hr className="border-t mt-2" />
			<div className="flex flex-col gap-1">
				<p className="text-sm text-[#666666] dark:text-[#A1A1A1]">Link</p>
				<p className="flex items-center gap-2">
					<Globe className="w-4 h-4 min-w-4 min-h-4" />
					<Link
						href={`${process.env.NEXT_PUBLIC_PROXY_SERVER_BASE_URL}/${displayDeploymentInfo.projectId}/`}
						className="overflow-auto truncate underline text-gray-600 dark:text-gray-300"
						target="_blank"
					>
						{`${process.env.NEXT_PUBLIC_PROXY_SERVER_BASE_URL}/${displayDeploymentInfo.projectId}/`}
					</Link>
				</p>
			</div>
			<hr className="border-t mt-2" />
			<div className="flex flex-col gap-1">
				<p className="text-sm text-[#666666] dark:text-[#A1A1A1]">Source</p>
				<div className="flex flex-col gap-1">
					<p className="flex items-center gap-2 text-sm">
						<GitBranch className="w-4 h-4" />
						<Link
							href={`https://github.com/${displayDeploymentInfo.githubProjectName}/tree/${displayDeploymentInfo.branch}`}
							target="_blank"
							className="hover:underline"
						>
							{displayDeploymentInfo.branch}
						</Link>
					</p>
					<p className="flex items-center gap-2 text-sm">
						<GitCommitHorizontal className="w-4 h-4" />
						<Link
							href={`https://github.com/${displayDeploymentInfo.githubProjectName}/tree/${displayDeploymentInfo.commitId}`}
							target="_blank"
							className="hover:underline"
						>
							{displayDeploymentInfo.commitId.slice(0, 7)}
						</Link>
					</p>
				</div>
			</div>
			<hr className="border-t mt-2" />
			<div>
				<h1 className="text-2xl font-semibold">Deployment Details</h1>
			</div>
			<Card className="rounded-lg mb-8">
				<CardContent className="p-0">
					<Accordion type="multiple" className="border rounded-lg">
						<AccordionItem value="deploy-logs" className="px-4">
							<AccordionTrigger>
								<div className="flex items-center w-full justify-between">
									<p>Build Logs</p>
									{displayDeploymentInfo.status !== DeploymentStatus.SUCCESS &&
									displayDeploymentInfo.status !== DeploymentStatus.FAILED ? (
										<Spinner size="lg" />
									) : (
										<div className="rounded-full bg-blue-600 p-1">
											<Check className="w-4 h-4 text-white dark:text-black" />
										</div>
									)}
								</div>
							</AccordionTrigger>
							<AccordionContent>
								<ScrollArea className="h-full w-full p-4">
									{displayDeploymentInfo.logEvent?.map((log, index) => (
										<p
											key={index}
											ref={
												index ===
												(displayDeploymentInfo.logEvent
													? displayDeploymentInfo.logEvent.length - 1
													: -1)
													? lastLogRef
													: null
											}
											className="font-mono tracking-wider mb-1"
										>
											{log.log}
										</p>
									))}
								</ScrollArea>
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="link" className="px-4">
							<AccordionTrigger>
								<div className="flex items-center w-full justify-between">
									<p>Assigning Link</p>
									{displayDeploymentInfo.status !== DeploymentStatus.SUCCESS &&
									displayDeploymentInfo.status !== DeploymentStatus.FAILED ? (
										<Spinner size="lg" />
									) : (
										<div className="rounded-full bg-blue-600 p-1">
											<Check className="w-4 h-4 text-white dark:text-black" />
										</div>
									)}
								</div>
							</AccordionTrigger>
							<AccordionContent className="px-4">
								<Link
									href={`${process.env.NEXT_PUBLIC_PROXY_SERVER_BASE_URL}/${displayDeploymentInfo.projectId}/`}
									className="overflow-auto truncate underline text-gray-600 dark:text-gray-300"
									target="_blank"
								>
									{`${process.env.NEXT_PUBLIC_PROXY_SERVER_BASE_URL}/${displayDeploymentInfo.projectId}/`}
								</Link>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</CardContent>
			</Card>
		</div>
	);
};
