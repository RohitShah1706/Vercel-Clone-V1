"use client";

import { useState } from "react";

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
import { ProjectsTable } from "./_components/projects-table";
import { columns } from "./_components/project-columns";
import { ProjectsGrid } from "./_components/projects-grid";
import { createProject } from "@/actions/project";
import { Project } from "@/app/types";

export default function DashboardPage() {
	const [search, setSearch] = useState("");
	const [sortBy, setSortBy] = useState("name");
	const [view, setView] = useState("grid");

	const [projects, setProjects] = useState<Project[]>([
		{
			id: "f0a1474b-5bed-47fd-9145-5100122dbcac",
			name: "project-1",
			githubProjectName: "RohitShah1706/vite_starter_template",
		},
		{
			id: "f0a1474b-5bed-47fd-9145-5100122dbc253",
			name: "project-2",
			githubProjectName: "RohitShah1706/Vercel-Clone-V1",
		},
		{
			id: "f0a1474b-5bed-47fd-9145-5100122dbc234",
			name: "project-3",
			githubProjectName: "RohitShah1706/file_drive_nextjs_shadcn_convex_clerk",
		},
	]);

	const createNewProject = async () => {
		const newProject: Project = {
			name: "New Project",
			githubProjectName: "RohitShah1706/vite_starter_template",
			envVars: {
				VITE_BASE_URI: "https://65cce93edd519126b83fcbff.mockapi.io/api/v1/",
			},
		};

		const project = await createProject(newProject);
	};

	return (
		<div className="container mt-8">
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
							<Button
								className="flex items-center gap-2"
								onClick={createNewProject}
							>
								Add New <PlusIcon className="w-4 h-4" />
							</Button>
						</a>
					</div>
					<div className="block sm:hidden">
						<a href="/new">
							<Button onClick={createNewProject}>
								<PlusIcon className="w-4 h-4 md:w-5 md:h-5" />
							</Button>
						</a>
					</div>
				</div>
			</div>

			{/* ! DISPLAY PROJECTS */}
			<div className="hidden md:block">
				{view === "table" && (
					<ProjectsTable columns={columns} data={projects} />
				)}
				{view === "grid" && <ProjectsGrid projects={projects} />}
			</div>

			<div className="block md:hidden">
				{/* ! TODO: DISPLAY cards but with smaller grid */}
				<ProjectsGrid projects={projects} />
			</div>
		</div>
	);
}
