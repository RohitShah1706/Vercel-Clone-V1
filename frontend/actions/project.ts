"use server";

import axios, { AxiosError } from "axios";

import { Project, UpdateProjectRequestBody } from "@/app/types";
import { getSession } from "./session";

const NEXT_PUBLIC_BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export const getUserProjects = async (): Promise<Project[]> => {
	const session = await getSession();

	if (!session) {
		return [];
	}

	try {
		const response = await axios.get(
			`${NEXT_PUBLIC_BACKEND_BASE_URL}/projects`,
			{
				headers: {
					Authorization: `Bearer ${session.accessToken}`,
				},
			}
		);

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
		const response = await axios.get(
			`${NEXT_PUBLIC_BACKEND_BASE_URL}/projects/${id}`,
			{
				headers: {
					Authorization: `Bearer ${session.accessToken}`,
				},
			}
		);

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
		const response = await axios.post(
			`${NEXT_PUBLIC_BACKEND_BASE_URL}/projects`,
			project,
			{
				headers: {
					Authorization: `Bearer ${session.accessToken}`,
				},
			}
		);
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
		const response = await axios.put(
			`${NEXT_PUBLIC_BACKEND_BASE_URL}/projects/${projectId}`,
			project,
			{
				headers: {
					Authorization: `Bearer ${session.accessToken}`,
				},
			}
		);

		return response.data;
	} catch (error: unknown) {
		const axiosError = error as AxiosError;
		if (axiosError.response && axiosError.response.status === 404) {
			console.log("error", axiosError.response.data);
		}
		return null;
	}
};
