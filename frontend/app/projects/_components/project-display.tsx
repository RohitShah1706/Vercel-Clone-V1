"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import { Project } from "@/app/types";
import { useState } from "react";
import { SelectActiveTab } from "./select-activetab";
import Link from "next/link";
import { ProjectTabSection } from "./project/project-tab-section";
import { DeploymentsTabSection } from "./deployments/deployments-tab-sections";
import { SettingsTabSection } from "./settings/settings-tab-section";

export const ProjectDisplay = ({ project }: { project: Project }) => {
	const [activeTab, setActiveTab] = useState<
		"project" | "deployments" | "settings"
	>("project");

	return (
		<div>
			<section>
				<div className="container flex items-center justify-between mt-10">
					<h1 className="text-[32px] font-[500] w-full lg:w-2/3 overflow-hidden truncate mr-4">
						{project.name}
					</h1>
					<div className="hidden lg:block">
						<div className="flex items-center gap-3">
							<div>
								<Tabs
									defaultValue="project"
									value={activeTab}
									onValueChange={(value) => {
										setActiveTab(
											value as "project" | "deployments" | "settings"
										);
									}}
								>
									<TabsList>
										<TabsTrigger value="project">Project</TabsTrigger>
										<TabsTrigger value="deployments">Deployments</TabsTrigger>
										<TabsTrigger value="settings">Settings</TabsTrigger>
									</TabsList>
								</Tabs>
							</div>
							<Link
								href={`https://github.com/${project.githubProjectName}`}
								target="_blank"
							>
								<Button variant="outline">Git Repository</Button>
							</Link>
							<Button>Visit</Button>
						</div>
					</div>
				</div>

				<div className="container block lg:hidden mt-4">
					<div className="flex items-center gap-4">
						<Button>Visit</Button>
						<Link
							href={`https://github.com/${project.githubProjectName}`}
							target="_blank"
						>
							<Button variant="outline">Git Repository</Button>
						</Link>
						<div className="hidden sm:block">
							<SelectActiveTab
								activeTab={activeTab}
								setActiveTab={setActiveTab}
							/>
						</div>
					</div>
				</div>

				<div className="container block sm:hidden mt-4">
					<SelectActiveTab activeTab={activeTab} setActiveTab={setActiveTab} />
				</div>

				<hr className="border-t mt-10" />
			</section>

			{activeTab === "project" && <ProjectTabSection project={project} />}
			{activeTab === "deployments" && (
				<DeploymentsTabSection project={project} />
			)}
			{activeTab === "settings" && <SettingsTabSection project={project} />}
		</div>
	);
};
