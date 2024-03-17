"use server";

import { AxiosError } from "axios";

import { Project, UpdateProjectRequestBody } from "@/types";
import { getSession } from "./session";
import { getAxiosInstance } from "./axios";

const NEXT_PUBLIC_BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export const getUserProjects = async (): Promise<Project[]> => {
	const session = await getSession();

	if (!session) {
		return [];
	}

	try {
		const axiosInstance = getAxiosInstance(session.accessToken as string);
		const response = await axiosInstance.get("/projects");

		return response.data;
	} catch (error: unknown) {
		const axiosError = error as AxiosError;
		if (axiosError.response && axiosError.response.status === 404) {
			return [];
		}

		return [];
	}
};

export const getProjectById = async (id: string): Promise<Project | null> => {
	const session = await getSession();

	if (!session) {
		return null;
	}

	try {
		const axiosInstance = getAxiosInstance(session.accessToken as string);
		const response = await axiosInstance.get(`/projects/${id}`);

		return response.data;
	} catch (error: unknown) {
		const axiosError = error as AxiosError;
		if (axiosError.response && axiosError.response.status === 404) {
			return null;
		}

		return null;
	}
};

export const createProject = async (
	project: Project
): Promise<Project | null> => {
	const session = await getSession();

	if (!session) {
		return null;
	}

	try {
		const axiosInstance = getAxiosInstance(session.accessToken as string);
		const response = await axiosInstance.post("/projects", project);

		return response.data;
	} catch (error: unknown) {
		const axiosError = error as AxiosError;
		if (axiosError.response && axiosError.response.status === 404) {
			console.log("error", axiosError.response.data);
		}
		return null;
	}
};

export const updateProjectDetails = async (
	projectId: string,
	project: UpdateProjectRequestBody
): Promise<Project | null> => {
	const session = await getSession();

	if (!session) {
		return null;
	}

	try {
		const axiosInstance = getAxiosInstance(session.accessToken as string);
		const response = await axiosInstance.put(`/projects/${projectId}`, project);

		return response.data;
	} catch (error: unknown) {
		const axiosError = error as AxiosError;
		if (axiosError.response && axiosError.response.status === 404) {
			console.log("error", axiosError.response.data);
		}
		return null;
	}
};
