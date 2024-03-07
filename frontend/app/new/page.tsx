"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/select";

import { getRepositories } from "@/actions/repo";
import { useEffect, useState } from "react";
import { Repository, RepositoryVisibility } from "../types";
import { Input } from "@/components/ui/input";
import { SkeletonCard } from "./_components/skeleton-card";
import { RepoCard } from "./_components/repo-cards";

export default function NewProjectPage() {
	const [repos, setRepos] = useState<Repository[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [search, setSearch] = useState<string>("");
	const [visibility, setVisibility] = useState<RepositoryVisibility>("public");

	useEffect(() => {
		setSearch("");
		const fetchRepos = async () => {
			setIsLoading(true);
			const repositories = await getRepositories(visibility);
			setRepos(repositories);
			setIsLoading(false);
		};

		fetchRepos();
	}, [visibility]);

	return (
		<div className="container max-w-3xl lg:max-w-5xl flex flex-col">
			<div className="mt-16 mb-16">
				<div className="container"></div>
				<h1 className="text-[40px] font-bold mb-2 leading-[50px]">{`Let's build something new.`}</h1>
				<p className="text-gray-600 dark:text-gray-300">
					To deploy a new Project, import an existing Git Repository from your
					GitHub account.
				</p>
			</div>

			<Card className="rounded-lg mb-12">
				<CardHeader>
					<CardTitle className="text-center lg:text-left">
						Import Git Repository
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col md:flex-row gap-3 items-center mb-8">
						<div className="w-full md:w-1/2">
							<Select
								onValueChange={(value) => {
									setVisibility(value as RepositoryVisibility);
								}}
								disabled={isLoading}
							>
								<SelectTrigger className="h-8 md:h-10">
									{visibility}
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="public" className="text-xs md:text-sm">
										Public
									</SelectItem>
									<SelectItem value="private" className="text-xs md:text-sm">
										Private
									</SelectItem>
									<SelectItem value="all" className="text-xs md:text-sm">
										All
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="w-full md:w-1/2">
							<Input
								value={search}
								placeholder="Search Repositories..."
								onChange={(e) => {
									setSearch(e.target.value);
								}}
								disabled={isLoading}
							/>
						</div>
					</div>

					<div className="flex flex-col overflow-y-scroll max-h-96 custom-scrollbar rounded-lg">
						{!isLoading &&
							repos &&
							repos.length > 0 &&
							repos
								.filter((repo) =>
									repo.name.toLowerCase().includes(search.toLowerCase())
								)
								.map((repo, key) => <RepoCard key={key} repo={repo} />)}

						{isLoading && (
							<>
								<SkeletonCard />
								<SkeletonCard />
								<SkeletonCard />
								<SkeletonCard />
							</>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
