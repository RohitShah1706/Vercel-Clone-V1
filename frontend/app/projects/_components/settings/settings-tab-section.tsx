import { Project } from "@/types";
import { Separator } from "@/components/ui/separator";
import { SettingsSidebarNav } from "./settings-sidebar-nav";
import { useState } from "react";
import { Dispatch, SetStateAction } from "react";
import { SettingsGeneralTab } from "./settings-general-tab";
import { SettingsEnvvarsTab } from "./settings-envvars-tab";
import { SettingsAdvancedTab } from "./settings-advanced-tab";

const sidebarNavItems = [
	{
		title: "General",
		value: "general",
	},
	{
		title: "Environment Variables",
		value: "envvars",
	},
	{
		title: "Advanced",
		value: "advanced",
	},
];

export const SettingsTabSection = ({
	project,
	setDisplayProject,
}: {
	project: Project;
	setDisplayProject: Dispatch<SetStateAction<Project>>;
}) => {
	const [activeTab, setActiveTab] = useState<
		"general" | "envvars" | "advanced"
	>("general");

	return (
		<section className="sm:container flex flex-col gap-8">
			<div className="space-y-6 p-6 pb-16">
				<div className="space-y-0.5">
					<h2 className="text-2xl font-bold tracking-tight">Settings</h2>
					<p className="text-muted-foreground">
						Manage your project settings and deployment preferences.
					</p>
				</div>
				<Separator className="my-6" />
				<div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
					<aside className="-mx-4 lg:w-1/5">
						<SettingsSidebarNav
							items={sidebarNavItems}
							activeTab={activeTab}
							setActiveTab={setActiveTab}
						/>
					</aside>
					<div className="flex-1 lg:max-w-4xl">
						{activeTab === "general" && (
							<SettingsGeneralTab
								project={project}
								setDisplayProject={setDisplayProject}
							/>
						)}
						{activeTab === "envvars" && (
							<SettingsEnvvarsTab
								project={project}
								setDisplayProject={setDisplayProject}
							/>
						)}
						{activeTab === "advanced" && (
							<SettingsAdvancedTab project={project} />
						)}
					</div>
				</div>
			</div>
		</section>
	);
};
