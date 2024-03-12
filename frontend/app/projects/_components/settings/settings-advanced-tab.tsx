"use client";

import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { z } from "zod";

import { Project } from "@/app/types";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const SettingsAdvancedTab = ({ project }: { project: Project }) => {
	const deleteProjectSchema = z.object({
		projectName: z.string().refine((value) => value === project.name, {
			message: "Project name must match the current project's name",
		}),
		verify: z.string().refine((value) => value === "delete my project", {
			message: "The verification phrase must be 'delete my project'",
		}),
	});

	const form = useForm<z.infer<typeof deleteProjectSchema>>({
		resolver: zodResolver(deleteProjectSchema),
		defaultValues: {
			projectName: "",
			verify: "",
		},
	});

	const handleDeleteProject = async (
		values: z.infer<typeof deleteProjectSchema>
	) => {
		// TODO: delete project
	};

	return (
		<>
			<Card className="rounded-lg w-full">
				<CardHeader>
					<CardTitle className="text-[20px]">Delete Project</CardTitle>
					<CardDescription>
						The project will be permanently deleted, including its deployments
						and domains. This action is irreversible and can not be undone.
					</CardDescription>
				</CardHeader>
				<CardFooter className="text-sm bg-[#FAFAFA] dark:bg-[#0B0B0A] py-3 flex flex-col sm:flex-row items-center justify-between gap-4 border">
					<Dialog
						onOpenChange={(open) => {
							if (open) {
								form.reset();
							}
						}}
					>
						<DialogTrigger asChild>
							<Button variant="destructive">Delete</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader className="flex flex-col gap-4">
								<DialogTitle className="text-2xl">Delete Project</DialogTitle>
								<DialogDescription>
									This project will be deleted, along with all of its
									Deployments, Domains, Environment Variables, Serverless
									Functions, and Settings.
								</DialogDescription>
								<p className="bg-red-100 text-sm rounded-lg p-2">
									<span className="font-bold">Warning: </span>
									<span className="text-red-600">
										This action is not reversible. Please be certain.
									</span>
								</p>
							</DialogHeader>

							<hr className="border-t" />

							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(handleDeleteProject)}
									className="flex flex-col gap-6"
								>
									<div className="flex flex-col gap-6">
										<FormField
											control={form.control}
											name="projectName"
											render={({ field }) => (
												<FormItem className="px-1">
													<FormLabel className="font-[300]">
														Enter the project name{" "}
														<span className="font-semibold">
															{project.name}
														</span>{" "}
														to continue:
													</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="verify"
											render={({ field }) => (
												<FormItem className="px-1">
													<FormLabel className="font-[300]">
														To verify, type{" "}
														<span className="font-semibold">
															delete my project
														</span>{" "}
														below
													</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<DialogFooter>
										<div className="w-full flex items-center justify-between">
											<DialogClose asChild>
												<Button variant="outline" type="reset">
													Cancel
												</Button>
											</DialogClose>
											<Button>Continue</Button>
										</div>
									</DialogFooter>
								</form>
							</Form>
						</DialogContent>
					</Dialog>
				</CardFooter>
			</Card>
		</>
	);
};
