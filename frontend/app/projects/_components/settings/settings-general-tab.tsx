"use client";

import { Project, UpdateProjectRequestBody } from "@/app/types";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { updateProjectDetails } from "@/actions/project";
import { Spinner } from "@/components/custom/spinner";

const formSchema = z.object({
	outDir: z.string().optional(),
	installCmd: z.string().optional(),
	buildCmd: z.string().optional(),
});

export const SettingsGeneralTab = ({
	project,
	setDisplayProject,
}: {
	project: Project;
	setDisplayProject: Dispatch<SetStateAction<Project>>;
}) => {
	const [projectName, setProjectName] = useState<string>(project.name || "");
	const [isLoading, setIsLoading] = useState(false);
	const [editMode, setEditMode] = useState({
		buildCmd: false,
		outDir: false,
		installCmd: false,
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

	const updateProjectName = async () => {
		setIsLoading(true);
		const newProjectDetails: UpdateProjectRequestBody = {
			name: projectName,
		};
		const response = await updateProjectDetails(
			project.id as string,
			newProjectDetails
		);
		if (response !== null) {
			setDisplayProject((prev) => {
				return {
					...prev,
					name: projectName,
				};
			});
		}
		setIsLoading(false);
	};

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setIsLoading(true);
		const newProjectDetails: UpdateProjectRequestBody = values;
		const response = await updateProjectDetails(
			project.id as string,
			newProjectDetails
		);
		if (response !== null) {
			setDisplayProject((prev) => {
				return {
					...prev,
					...newProjectDetails,
				};
			});
		}
		setIsLoading(false);
	};

	return (
		<div className="flex flex-col gap-8">
			{/* projectName settings */}
			<Card className="rounded-lg w-full">
				<CardHeader>
					<CardTitle className="text-[20px]">Project Name</CardTitle>
					<CardDescription>
						Used to identify your Project on the Dashboard.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Input
						type="text"
						placeholder={project.name || "Project Name"}
						value={projectName}
						onChange={(e) => {
							setProjectName(e.target.value);
						}}
					/>
				</CardContent>
				<CardFooter className="text-sm bg-[#FAFAFA] dark:bg-[#0B0B0A] py-3 flex flex-col sm:flex-row items-center justify-between gap-4 border">
					<p className="flex flex-col sm:flex-row items-center gap-1">
						Learn more about{" "}
						<Link
							href="https://vercel.com/docs/projects/overview#project-name"
							target="_blank"
							className="text-blue-600 flex items-center gap-1 hover:underline"
						>
							Project Name <ExternalLink className="w-4 h-4" />
						</Link>
					</p>
					<Button
						onClick={updateProjectName}
						className="flex items-center gap-2"
						disabled={isLoading}
					>
						Save
						{isLoading && <Spinner size="lg" />}
					</Button>
				</CardFooter>
			</Card>

			{/* buildCmd, outDir, installCmd settings */}
			<Card className="rounded-lg w-full">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<CardHeader>
							<CardTitle className="text-[20px]">
								Build & Development Settings
							</CardTitle>
							<CardDescription>
								When creating a new project, it will be automatically configured
								to default values. You can override them below.
							</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col gap-6">
							{/* buildCmd input */}
							<div className="flex gap-4">
								<div className="w-full">
									<FormField
										disabled={!editMode.buildCmd}
										control={form.control}
										name="buildCmd"
										render={({ field }) => (
											<FormItem className="px-1">
												<FormLabel>Build Command</FormLabel>
												<FormControl>
													<Input
														placeholder={project.buildCmd || "npm run build"}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="flex items-center gap-2 mt-7">
									<p className="text-sm font-[500] hidden sm:block">OVERRIDE</p>
									<Switch
										checked={editMode.buildCmd}
										onCheckedChange={(checked) => {
											setEditMode((prev) => ({
												...prev,
												buildCmd: checked,
											}));
										}}
										aria-readonly
									/>
								</div>
							</div>

							{/* outDir input */}
							<div className="flex gap-4">
								<div className="w-full">
									<FormField
										disabled={!editMode.outDir}
										control={form.control}
										name="outDir"
										render={({ field }) => (
											<FormItem className="px-1">
												<FormLabel>Output Directory</FormLabel>
												<FormControl>
													<Input
														placeholder={project.outDir || "dist"}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="flex items-center gap-2 mt-7">
									<p className="text-sm font-[500] hidden sm:block">OVERRIDE</p>
									<Switch
										checked={editMode.outDir}
										onCheckedChange={(checked) => {
											setEditMode((prev) => ({
												...prev,
												outDir: checked,
											}));
										}}
										aria-readonly
									/>
								</div>
							</div>

							{/* installCmd input */}
							<div className="flex gap-4">
								<div className="w-full">
									<FormField
										disabled={!editMode.installCmd}
										control={form.control}
										name="installCmd"
										render={({ field }) => (
											<FormItem className="px-1">
												<FormLabel>Install Command</FormLabel>
												<FormControl>
													<Input
														placeholder={project.installCmd || "npm install"}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="flex items-center gap-2 mt-7">
									<p className="text-sm font-[500] hidden sm:block">OVERRIDE</p>
									<Switch
										checked={editMode.installCmd}
										onCheckedChange={(checked) => {
											setEditMode((prev) => ({
												...prev,
												installCmd: checked,
											}));
										}}
										aria-readonly
									/>
								</div>
							</div>
						</CardContent>
						<CardFooter className="text-sm bg-[#FAFAFA] dark:bg-[#0B0B0A] py-3 flex flex-col sm:flex-row items-center justify-between gap-4 border">
							<p className="flex flex-col sm:flex-row items-center gap-1">
								Learn more about{" "}
								<Link
									href="https://vercel.com/docs/deployments/configure-a-build#build-and-development-settings"
									target="_blank"
									className="text-blue-600 flex items-center gap-1 hover:underline"
								>
									Build and Development settings{" "}
									<ExternalLink className="w-4 h-4" />
								</Link>
							</p>
							<Button
								type="submit"
								className="flex items-center gap-2"
								disabled={isLoading}
							>
								Save
								{isLoading && <Spinner size="lg" />}
							</Button>
						</CardFooter>
					</form>
				</Form>
			</Card>
		</div>
	);
};
