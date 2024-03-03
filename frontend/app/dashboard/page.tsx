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
import {
	DeploymentStatus,
	Project,
	columns,
} from "./_components/project-columns";
import { ProjectsGrid } from "./_components/projects-grid";

export default function DashboardPage() {
	const [search, setSearch] = useState("");
	const [sortBy, setSortBy] = useState("name");
	const [view, setView] = useState("grid");

	const [projects, setProjects] = useState<Project[]>([
		{
			id: "f0a1474b-5bed-47fd-9145-5100122dbcac",
			name: "project-1",
			githubProjectName: "RohitShah1706/vite_starter_template",
			lastDeployment: {
				id: "f0a1474b-5bed-47fd-9145-5100122dbcac",
				branch: "main",
				commitId: "548fabaf2b00709e012d803e0636b543e9902602",
				status: DeploymentStatus.SUCCESS,
				createdAt: new Date("2024-01-05T14:48:00.000Z"),
			},
			buildCmd: "npm run build",
			installCmd: "npm install",
			outDir: "dist",
			rootDir: ".",
			envVars: null,
			user: null,
		},
		{
			id: "f0a1474b-5bed-47fd-9145-5100122dbcac",
			name: "project-1",
			githubProjectName: "RohitShah1706/vite_starter_template",
			lastDeployment: {
				id: "f0a1474b-5bed-47fd-9145-5100122dbcac",
				branch: "main",
				commitId: "548fabaf2b00709e012d803e0636b543e9902602",
				status: DeploymentStatus.SUCCESS,
				createdAt: new Date("2024-01-05T14:48:00.000Z"),
			},
			buildCmd: "npm run build",
			installCmd: "npm install",
			outDir: "dist",
			rootDir: ".",
			envVars: null,
			user: null,
		},
		{
			id: "f0a1474b-5bed-47fd-9145-5100122dbcac",
			name: "project-1",
			githubProjectName: "RohitShah1706/vite_starter_template",
			lastDeployment: {
				id: "f0a1474b-5bed-47fd-9145-5100122dbcac",
				branch: "main",
				commitId: "548fabaf2b00709e012d803e0636b543e9902602",
				status: DeploymentStatus.SUCCESS,
				createdAt: new Date("2024-01-05T14:48:00.000Z"),
			},
			buildCmd: "npm run build",
			installCmd: "npm install",
			outDir: "dist",
			rootDir: ".",
			envVars: null,
			user: null,
		},
		{
			id: "f0a1474b-5bed-47fd-9145-5100122dbcac",
			name: "project-1",
			githubProjectName: "RohitShah1706/vite_starter_template",
			lastDeployment: {
				id: "f0a1474b-5bed-47fd-9145-5100122dbcac",
				branch: "main",
				commitId: "548fabaf2b00709e012d803e0636b543e9902602",
				status: DeploymentStatus.SUCCESS,
				createdAt: new Date("2024-01-05T14:48:00.000Z"),
			},
			buildCmd: "npm run build",
			installCmd: "npm install",
			outDir: "dist",
			rootDir: ".",
			envVars: null,
			user: null,
		},
		{
			id: "f0a1474b-5bed-47fd-9145-5100122dbcac",
			name: "project-1",
			githubProjectName: "RohitShah1706/vite_starter_template",
			lastDeployment: {
				id: "f0a1474b-5bed-47fd-9145-5100122dbcac",
				branch: "main",
				commitId: "548fabaf2b00709e012d803e0636b543e9902602",
				status: DeploymentStatus.SUCCESS,
				createdAt: new Date("2024-01-05T14:48:00.000Z"),
			},
			buildCmd: "npm run build",
			installCmd: "npm install",
			outDir: "dist",
			rootDir: ".",
			envVars: null,
			user: null,
		},
	]);

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
						<Button className="flex items-center gap-2">
							Add New <PlusIcon className="w-4 h-4" />
						</Button>
					</div>
					<div className="block sm:hidden">
						<Button>
							<PlusIcon className="w-4 h-4 md:w-5 md:h-5" />
						</Button>
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
