export interface User {
	email: string;
	username: string;
}

export enum DeploymentStatus {
	QUEUED = "QUEUED",
	DEPLOYING = "DEPLOYING",
	SUCCESS = "SUCCESS",
	FAILED = "FAILED",
}

export interface Project {
	id?: string;
	name: string;
	buildCmd?: string;
	installCmd?: string;
	outDir?: string;
	rootDir?: string;
	githubProjectName: string;
	lastDeployment?: {
		id: string;
		branch: string;
		commitId: string;
		status: DeploymentStatus;
		createdAt: Date;
	};
	envVars?: Record<string, string>;
	user?: {
		email: string;
	};
}

export type RepositoryVisibility = "all" | "private" | "public";

export interface LogEvent {
	log: string;
}

export interface Repository {
	name: string;
	full_name: string;
	updated_at: string;
	clone_url: string;
	visibility: RepositoryVisibility;
	default_branch: string;
	last_commit_id: string;
}

export interface Deployment {
	id: string;
	branch: string;
	commitId: string;
	status: DeploymentStatus;
	createdAt: Date;
	logEvent?: LogEvent[];
	githubProjectName?: string;
	isActive?: boolean;
	projectId?: string;
}

export interface UpdateProjectRequestBody {
	name?: string;
	rootDir?: string;
	outDir?: string;
	installCmd?: string;
	buildCmd?: string;
}
