import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dot, ExternalLink } from "lucide-react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDeployment } from "@/actions/deployment";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/custom/spinner";
import { useState } from "react";
import { Project } from "@/types";

export const NewDeploymentInput = ({ project }: { project: Project }) => {
	const { toast } = useToast();
	const router = useRouter();

	const [isLoading, setIsLoading] = useState(false);

	const createDeploymentSchema = z.object({
		commitId: z.string().length(40, {
			message: "You must provide a valid commit id",
		}),
		branch: z.string().min(1, {
			message: "You must provide a valid branch",
		}),
	});

	const form = useForm<z.infer<typeof createDeploymentSchema>>({
		resolver: zodResolver(createDeploymentSchema),
		defaultValues: {
			commitId: "",
			branch: "",
		},
	});

	const handleCreateDeployment = async (
		values: z.infer<typeof createDeploymentSchema>
	) => {
		setIsLoading(true);
		const response = await createDeployment({
			...values,
			projectId: project.id as string,
		});

		setIsLoading(false);
		if (response !== null) {
			router.push(`/deployments/${response.id}`);
		} else {
			form.reset();
			toast({
				variant: "destructive",
				title: "Something went wrong.",
				description: "There was a problem creating the deployment.",
			});
		}
	};

	return (
		<>
			<div className="hidden sm:block">
				<Dialog
					onOpenChange={(open) => {
						if (open) {
							form.reset();
						}
					}}
				>
					<DialogTrigger asChild>
						<Button variant="outline">
							<Dot className="w-4 h-4 -ml-[11px] -mr-[11px]" />
							<Dot className="w-4 h-4 -mr-[11px]" />
							<Dot className="w-4 h-4 -mr-[11px]" />
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-xl">
						<DialogHeader>
							<DialogTitle>
								<h1 className="text-2xl font-semibold">Create Deployment</h1>
							</DialogTitle>
						</DialogHeader>
						<div className="flex flex-col gap-7 mt-2">
							<div className="flex items-center gap-2">
								<div className="block dark:hidden">
									<Image
										src="/github.svg"
										alt="github"
										width={32}
										height={32}
									/>
								</div>
								<div className="hidden dark:block">
									<Image
										src="/github-white.svg"
										alt="github"
										width={32}
										height={32}
									/>
								</div>
								<Link
									href={`https://github.com/${project.githubProjectName}`}
									target="_blank"
									className="flex items-center gap-1 hover:underline"
								>
									<p>{project.githubProjectName}</p>
									<ExternalLink className="w-4 h-4" />
								</Link>
							</div>
							<p className="text-[16px]">
								Paste a valid commit id and valid branch to create a new
								deployment in addition to those auto-generated from{" "}
								<span className="font-mono">{project.githubProjectName}</span>
							</p>
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(handleCreateDeployment)}
									className="flex flex-col gap-6"
								>
									<div className="flex flex-col gap-6">
										<FormField
											control={form.control}
											name="commitId"
											disabled={isLoading}
											render={({ field }) => (
												<FormItem className="px-1">
													<FormLabel className="font-[300]">
														Enter the commit id to continue:
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
											name="branch"
											disabled={isLoading}
											render={({ field }) => (
												<FormItem className="px-1">
													<FormLabel className="font-[300]">
														Enter the branch to continue:
													</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<DialogFooter className="sm:justify-between mt-2 gap-2">
										<DialogClose asChild disabled={isLoading}>
											<Button type="button" variant="secondary">
												Close
											</Button>
										</DialogClose>
										<Button
											type="submit"
											className="flex items-center gap-3"
											disabled={isLoading}
										>
											<p>Create Deployment</p>
											{isLoading && <Spinner size="lg" />}
										</Button>
									</DialogFooter>
								</form>
							</Form>
						</div>
					</DialogContent>
				</Dialog>
			</div>
			<div className="block sm:hidden">
				<Drawer
					onOpenChange={(open) => {
						if (open) {
							form.reset();
						}
					}}
				>
					<DrawerTrigger>
						<Button variant="outline">
							<Dot className="w-4 h-4 -ml-[11px] -mr-[11px]" />
							<Dot className="w-4 h-4 -mr-[11px]" />
							<Dot className="w-4 h-4 -mr-[11px]" />
						</Button>
					</DrawerTrigger>
					<DrawerContent className="p-4">
						<DrawerHeader>
							<DrawerTitle>
								<h1 className="text-2xl font-semibold">Create Deployment</h1>
							</DrawerTitle>
						</DrawerHeader>
						<div className="flex flex-col gap-7 mt-2">
							<div className="flex items-center gap-2">
								<div className="block dark:hidden">
									<Image
										src="/github.svg"
										alt="github"
										width={32}
										height={32}
									/>
								</div>
								<div className="hidden dark:block">
									<Image
										src="/github-white.svg"
										alt="github"
										width={32}
										height={32}
									/>
								</div>
								<Link
									href={`https://github.com/${project.githubProjectName}`}
									target="_blank"
									className="flex items-center gap-1 hover:underline"
								>
									<p>{project.githubProjectName}</p>
									<ExternalLink className="w-4 h-4" />
								</Link>
							</div>
							<p className="text-[16px]">
								Paste a valid commit id and valid branch to create a new
								deployment in addition to those auto-generated from{" "}
								<span className="font-mono">{project.githubProjectName}</span>
							</p>
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(handleCreateDeployment)}
									className="flex flex-col gap-6"
								>
									<div className="flex flex-col gap-6">
										<FormField
											control={form.control}
											name="commitId"
											disabled={isLoading}
											render={({ field }) => (
												<FormItem className="px-1">
													<FormLabel className="font-[300]">
														Enter the commit id to continue:
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
											name="branch"
											disabled={isLoading}
											render={({ field }) => (
												<FormItem className="px-1">
													<FormLabel className="font-[300]">
														Enter the branch to continue:
													</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<DrawerFooter className="flex flex-col-reverse mt-2 gap-2">
										<DrawerClose asChild disabled={isLoading}>
											<Button type="button" variant="secondary">
												Close
											</Button>
										</DrawerClose>
										<Button
											type="submit"
											className="flex items-center gap-3"
											disabled={isLoading}
										>
											<p>Create Deployment</p>
											{isLoading && <Spinner size="lg" />}
										</Button>
									</DrawerFooter>
								</form>
							</Form>
						</div>
					</DrawerContent>
				</Drawer>
			</div>
		</>
	);
};
