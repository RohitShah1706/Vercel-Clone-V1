"use client";

import { Project } from "@/types";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SettingsDisplayEnvVar } from "./settings-display-env-var";
import { Dispatch, SetStateAction } from "react";
import { addEnvVar, removeEnvVar } from "@/actions/envvars";
import { useToast } from "@/components/ui/use-toast";
import { EnvVarsAddInput } from "@/components/custom/envvars-add-input";

export const SettingsEnvvarsTab = ({
	project,
	setDisplayProject,
}: {
	project: Project;
	setDisplayProject: Dispatch<SetStateAction<Project>>;
}) => {
	const { toast } = useToast();

	const [isLoading, setIsLoading] = useState(false);
	const [newKey, setNewKey] = useState("");
	const [newValue, setNewValue] = useState("");

	const handleAddEnvVar = async () => {
		setIsLoading(true);
		const response = await addEnvVar({
			projectId: project.id as string,
			key: newKey,
			value: newValue,
		});

		if (response === "SUCCESS") {
			toast({
				title: "Added Environment Variable",
				description: "The environment variable was added successfully.",
			});
			setDisplayProject((prev) => ({
				...prev,
				envVars: {
					...prev.envVars,
					[newKey]: newValue,
				},
			}));
		} else {
			toast({
				variant: "destructive",
				title: "Something went wrong.",
				description: "There was a problem adding the environment variable.",
			});
		}
		setNewKey("");
		setNewValue("");
		setIsLoading(false);
	};

	const handleRemoveEnvVar = async (keyToRemove: string) => {
		setIsLoading(true);
		const response = await removeEnvVar({
			projectId: project.id as string,
			key: keyToRemove,
		});

		if (response === "SUCCESS") {
			toast({
				title: "Removed Environment Variable",
				description: "The environment variable was removed successfully.",
			});
			const newEnvVars = { ...project.envVars };
			delete newEnvVars[keyToRemove];
			setDisplayProject((prev) => ({
				...prev,
				envVars: newEnvVars,
			}));
		} else {
			toast({
				variant: "destructive",
				title: "Something went wrong.",
				description: "There was a problem removing the environment variable.",
			});
		}

		setIsLoading(false);
	};

	return (
		<div className="flex flex-col gap-8">
			<Card className="rounded-lg w-full">
				<CardHeader>
					<CardTitle className="text-[20px]">Environment Variables</CardTitle>
					<CardDescription>
						In order to provide your Deployment with Environment Variables at
						Build and Runtime, you may enter them right here.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-8">
						{/* envVars add input */}
						<EnvVarsAddInput
							newKey={newKey}
							setNewKey={setNewKey}
							newValue={newValue}
							setNewValue={setNewValue}
							handleAddEnvVar={handleAddEnvVar}
							isLoading={isLoading}
						/>

						{/* envVars display */}
						<div className="flex flex-col items-center gap-2">
							{Object.entries(project.envVars ? project.envVars : {}).map(
								([key, value]) => (
									<SettingsDisplayEnvVar
										projectId={project.id as string}
										key={key}
										envVarKey={key}
										handleRemoveEnvVar={handleRemoveEnvVar}
										isLoading={isLoading}
									/>
								)
							)}
						</div>
					</div>
				</CardContent>
				<CardFooter className="text-sm bg-[#FAFAFA] dark:bg-[#0B0B0A] py-3 flex flex-col sm:flex-row items-center justify-between gap-4 border">
					<p className="flex flex-col sm:flex-row items-center gap-1 ">
						Learn more about{" "}
						<Link
							href="https://vercel.com/docs/environment-variables"
							target="_blank"
							className="text-blue-600 flex items-center gap-1 hover:underline"
						>
							Environment Variables <ExternalLink className="w-4 h-4" />
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
};
