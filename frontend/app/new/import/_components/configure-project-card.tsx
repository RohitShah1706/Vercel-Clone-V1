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
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { DisplayEnvVar } from "./display-envvar";

export const ConfigureProjectCard = ({
	projectName,
	setProjectName,
}: {
	projectName: string | null;
	setProjectName: Dispatch<SetStateAction<string | null>>;
}) => {
	const [newKey, setNewKey] = useState("");
	const [newValue, setNewValue] = useState("");
	const [editMode, setEditMode] = useState({
		buildCmd: false,
		outDir: false,
		installCmd: false,
	});

	// ! inputs to recreate using zod -> will go POST /projects
	const [envVars, setEnvVars] = useState<Record<string, string>>({});
	const [rootDir, setRootDir] = useState<string>("");
	const [outDir, setOutDir] = useState<string>("");
	const [installCmd, setInstallCmd] = useState<string>("");
	const [buildCmd, setBuildCmd] = useState<string>("");

	const handleAddEnvVar = () => {
		setEnvVars((prevEnvVars) => ({
			...prevEnvVars,
			[newKey]: newValue,
		}));
		setNewKey("");
		setNewValue("");
	};

	const handleRemoveEnvVar = (keyToRemove: string) => {
		setEnvVars((prevEnvVars) => {
			const { [keyToRemove]: _, ...rest } = prevEnvVars;
			return rest;
		});
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
				<div className="flex flex-col gap-6">
					{/* project name input */}
					<div className="w-full flex flex-col gap-2">
						<Label htmlFor="projectName">Project Name</Label>
						<Input
							type="text"
							id="projectName"
							placeholder={projectName || "Project Name"}
							className="w-full"
							value={projectName || ""}
							onChange={(e) => setProjectName(e.target.value)}
						/>
					</div>

					{/* rootdir input */}
					<div className="w-full flex flex-col gap-2">
						<Label htmlFor="rootDir">Root Directory</Label>
						<Input
							type="text"
							id="rootDir"
							placeholder="./"
							className="w-full"
							value={rootDir}
							onChange={(e) => setRootDir(e.target.value)}
						/>
					</div>

					{/* accordion for build settings & envvars */}
					<div>
						<Accordion type="multiple" className="border rounded-lg">
							{/* build and output inputs */}
							<AccordionItem value="buildAndOutputInputs" className="px-4">
								<AccordionTrigger>Build and Output Settings</AccordionTrigger>
								<AccordionContent className="flex flex-col gap-6 mt-4">
									{/* buildCmd input */}
									<div className="flex flex-col gap-2">
										<Label htmlFor="buildCmd">Build Command</Label>
										<div className="flex items-center gap-4">
											<div className="w-full flex flex-col gap-2">
												<Input
													type="text"
													id="buildCmd"
													placeholder="npm run build"
													value={buildCmd}
													className="w-full"
													onChange={(e) => setBuildCmd(e.target.value)}
													disabled={!editMode.buildCmd}
												/>
											</div>
											<div className="flex items-center gap-2">
												<p>OVERRIDE</p>
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
									</div>
									{/* outDir input */}
									<div className="flex flex-col gap-2">
										<Label htmlFor="outDir">Output Directory</Label>
										<div className="flex items-center gap-4">
											<div className="w-full flex flex-col gap-2">
												<Input
													type="text"
													id="outDir"
													placeholder="dist"
													className="w-full"
													value={outDir}
													onChange={(e) => setOutDir(e.target.value)}
													disabled={!editMode.outDir}
												/>
											</div>
											<div className="flex items-center gap-2">
												<p>OVERRIDE</p>
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
									</div>
									{/* installCmd input */}
									<div className="flex flex-col gap-2">
										<Label htmlFor="installCmd">Install Command</Label>
										<div className="flex items-center gap-4">
											<div className="w-full flex flex-col gap-2">
												<Input
													type="text"
													id="installCmd"
													placeholder="npm install"
													className="w-full"
													value={installCmd}
													onChange={(e) => setInstallCmd(e.target.value)}
													disabled={!editMode.installCmd}
												/>
											</div>
											<div className="flex items-center gap-2">
												<p>OVERRIDE</p>
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
														variant="secondary"
														className="px-5"
														onClick={handleAddEnvVar}
													>
														Add
													</Button>
												</div>
											</div>
											<Button
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
					<Button>Deploy</Button>
				</div>
			</CardContent>
		</Card>
	);
};
