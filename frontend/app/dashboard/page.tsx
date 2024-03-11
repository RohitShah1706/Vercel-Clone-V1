import { getUserProjects } from "@/actions/project";
import { DashboardDisplay } from "./_components/dashboard-display";

export default async function DashboardPage() {
	const projects = await getUserProjects();
	return <DashboardDisplay projects={projects} />;
}
