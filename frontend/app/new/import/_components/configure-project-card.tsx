"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { DisplayEnvVar } from "./display-envvar";
import { Project } from "@/app/types";
import { createProject } from "@/actions/project";
import { Spinner } from "@/components/custom/spinner";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
	name: z.string().min(1, "Project Name is required"),
	githubProjectName: z.string().min(1, "GitHub Project Name is required"),
	rootDir: z.string().optional(),
	outDir: z.string().optional(),
	installCmd: z.string().optional(),
	buildCmd: z.string().optional(),
	envVars: z.record(z.string()).optional(),
});

export const ConfigureProjectCard = ({
	projectName,
	src,
}: {
	projectName: string | null;
	src: string | null;
}) => {
	const { toast } = useToast();
	const router = useRouter();

	const [newKey, setNewKey] = useState("");
	const [newValue, setNewValue] = useState("");
	const [editMode, setEditMode] = useState({
		buildCmd: false,
		outDir: false,
		installCmd: false,
	});
	const [loading, setLoading] = useState(false);

	const [envVars, setEnvVars] = useState<Record<string, string>>({});

	const handleAddEnvVar = () => {
		const updatedEnvVars = { ...envVars, [newKey]: newValue };
		setEnvVars(updatedEnvVars);
		form.setValue("envVars", updatedEnvVars, { shouldValidate: true });
		setNewKey("");
		setNewValue("");
	};

	const handleRemoveEnvVar = (keyToRemove: string) => {
		const { [keyToRemove]: _, ...rest } = envVars;
		setEnvVars(rest);
		form.setValue("envVars", rest, { shouldValidate: true });
	};

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: projectName || "",
			githubProjectName: src || "",
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		const project: Project = values;
		setLoading(true);
		const result = await createProject(project);
		if (result) {
			toast({
				title: "Project Created successfully!",
				description: "Redirecting to the dashboard in 3 seconds",
			});
			setTimeout(() => {
				router.push("/dashboard");
			}, 3000);
		}
		setLoading(false);
	};

	return (
		<Card className="rounded-lg">
			<CardHeader>
				<CardTitle className="text-center lg:text-left px-2 py-4 -mb-2">
					Configure Project
					<hr className="border-t border-accents-2 mt-6 mr-16" />
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-6"
					>
						{/* project name input */}
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem className="px-1">
									<FormLabel>Project Name</FormLabel>
									<FormControl>
										<Input placeholder={projectName || ""} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* github repo disabled input */}
						<FormField
							control={form.control}
							name="githubProjectName"
							render={({ field }) => (
								<FormItem className="px-1">
									<FormLabel>GitHub Repository</FormLabel>
									<FormControl>
										<Input placeholder={src || ""} {...field} disabled />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* rootdir input */}
						<FormField
							control={form.control}
							name="rootDir"
							render={({ field }) => (
								<FormItem className="px-1">
									<FormLabel>Root Directory</FormLabel>
									<FormControl>
										<Input placeholder="./" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* accordion for build settings & envvars */}
						<div>
							<Accordion type="multiple" className="border rounded-lg">
								{/* build and output inputs */}
								<AccordionItem value="buildAndOutputInputs" className="px-4">
									<AccordionTrigger>Build and Output Settings</AccordionTrigger>
									<AccordionContent className="flex flex-col gap-6 mt-4">
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
																<Input placeholder="npm run build" {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>

											<div className="flex items-center gap-2 mt-6">
												<p className="hidden sm:block">OVERRIDE</p>
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
																<Input placeholder="dist" {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>

											<div className="flex items-center gap-2 mt-6">
												<p className="hidden sm:block">OVERRIDE</p>
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
																<Input placeholder="npm install" {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>

											<div className="flex items-center gap-2 mt-6">
												<p className="hidden sm:block">OVERRIDE</p>
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
									</AccordionContent>
								</AccordionItem>

								{/* envVars */}
								<AccordionItem value="envVarsInput" className="px-4">
									<AccordionTrigger>Environment Variables</AccordionTrigger>
									<AccordionContent className="mt-4">
										<div className="flex flex-col gap-8">
											{/* envVars add input */}
											<div className="flex flex-col items-center gap-6">
												<div className="flex gap-4 items-center w-full">
													<div className="w-full sm:w-[90%] flex gap-2">
														<div className="w-full flex flex-col gap-2">
															<Label htmlFor="envVarKey">Key</Label>
															<Input
																type="text"
																id="envVarKey"
																placeholder="EXAMPLE_NAME"
																className="w-full"
																value={newKey}
																onChange={(e) => setNewKey(e.target.value)}
															/>
														</div>

														<div className="w-full flex flex-col gap-2">
															<Label htmlFor="envVarValue">
																<p className="hidden sm:block">
																	Value (Will Be Encrypted)
																</p>
																<p className="block sm:hidden">Value</p>
															</Label>
															<Input
																type="text"
																id="envVarValue"
																placeholder="I9JU23NF39R6HH"
																className="w-full"
																value={newValue}
																onChange={(e) => setNewValue(e.target.value)}
															/>
														</div>
													</div>
													<div className="hidden sm:block mt-[19.1px]">
														<Button
															type="button"
															variant="secondary"
															className="px-5"
															onClick={handleAddEnvVar}
														>
															Add
														</Button>
													</div>
												</div>
												<Button
													type="button"
													variant="secondary"
													className="block sm:hidden w-full"
													onClick={handleAddEnvVar}
												>
													Add
												</Button>
											</div>

											{/* envVars display */}
											<div className="flex flex-col items-center gap-2">
												{Object.entries(envVars).map(([key, value]) => (
													<DisplayEnvVar
														key={key}
														envVarKey={key}
														envVarValue={value}
														handleRemoveEnvVar={handleRemoveEnvVar}
													/>
												))}
											</div>
										</div>
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</div>

						{/* deploy button */}
						<Button type="submit" className="flex gap-2" disabled={loading}>
							Deploy
							{loading && <Spinner size="lg" />}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};
