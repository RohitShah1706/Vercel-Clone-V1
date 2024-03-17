"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GridIcon, PlusIcon, RowsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Project } from "@/types";
import { useEffect, useState } from "react";
import { ProjectsTable } from "./projects-table";
import { ProjectsGrid } from "./projects-grid";
import { projectColumns } from "./project-columns";

export const DashboardDisplay = ({ projects }: { projects: Project[] }) => {
	const [search, setSearch] = useState("");
	const [sortBy, setSortBy] = useState("name");
	const [view, setView] = useState("grid");
	const [displayProducts, setDisplayProducts] = useState(projects);

	useEffect(() => {
		setDisplayProducts(
			projects.filter((project) =>
				project.name.toLowerCase().includes(search.toLowerCase())
			)
		);
	}, [search, projects]);

	return (
		<div className="container mt-8">
			{/* filters and search components */}
			<div className="flex space-x-2 items-center mb-8">
				{/* ! SEARCH INPUT */}
				<div className="flex-grow">
					<Input
						value={search}
						placeholder="Search Repositories and Projects..."
						onChange={(e) => {
							setSearch(e.target.value);
						}}
						className="bg-[#FEFFFE] dark:bg-[#0B0B0A]"
					/>
				</div>

				{/* ! SORT BY ACTIVITY OR NAME */}
				<div className="w-1/7 hidden lg:block">
					<Select
						onValueChange={(value) => {
							setSortBy(value);
						}}
					>
						<SelectTrigger className="w-[180px] font-semibold bg-[#FEFFFE] dark:bg-[#0B0B0A]">
							<SelectValue placeholder="Sort by name" />
						</SelectTrigger>
						<SelectContent className="bg-[#FEFFFE] dark:bg-[#0B0B0A]">
							<SelectItem value="name">Sort by name</SelectItem>
							<SelectItem value="activity">Sort by activity</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* ! GRID OR TABLE VIEW */}
				<div className="w-1/7 hidden md:block">
					<Tabs
						defaultValue={view}
						onValueChange={(value) => {
							setView(value);
						}}
					>
						<TabsList>
							<TabsTrigger
								value="grid"
								className="flex items-center gap-2 bg-[#FEFFFE] dark:bg-[#0B0B0A]"
							>
								<GridIcon className="w-4 h-4 md:w-5 md:h-5" /> Grid
							</TabsTrigger>
							<TabsTrigger
								value="table"
								className="flex items-center gap-2 bg-[#FEFFFE] dark:bg-[#0B0B0A]"
							>
								<RowsIcon className="w-4 h-4 md:w-5 md:h-5" /> Table
							</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>

				{/* ! ADD NEW PROJECT */}
				<div className="w-1/7">
					<div className="hidden sm:block">
						<a href="/new">
							<Button className="flex items-center gap-2">
								Add New <PlusIcon className="w-4 h-4" />
							</Button>
						</a>
					</div>
					<div className="block sm:hidden">
						<a href="/new">
							<Button>
								<PlusIcon className="w-4 h-4 md:w-5 md:h-5" />
							</Button>
						</a>
					</div>
				</div>
			</div>

			{/* ! DISPLAY PROJECTS */}
			<div className="hidden md:block">
				{view === "table" && (
					<ProjectsTable columns={projectColumns} data={displayProducts} />
				)}
				{view === "grid" && <ProjectsGrid projects={displayProducts} />}
			</div>

			<div className="block md:hidden">
				{/* ! TODO: DISPLAY cards but with smaller grid */}
				<ProjectsGrid projects={displayProducts} />
			</div>
		</div>
	);
};
