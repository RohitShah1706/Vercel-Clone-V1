"use server";

import { AxiosError } from "axios";

import { Repository, RepositoryVisibility } from "@/app/types";
import { getSession } from "./session";
import { getAxiosInstance } from "./axios";

const NEXT_PUBLIC_BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export const getRepositories = async (
	visibility: RepositoryVisibility
): Promise<Repository[]> => {
	const session = await getSession();
	if (!session) {
		return [];
	}

	try {
		const axiosInstance = getAxiosInstance(session.accessToken as string);
		const response = await axiosInstance.get(`/repos?visibility=${visibility}`);

		return response.data;
	} catch (error: unknown) {
		const axiosError = error as AxiosError;
		if (axiosError.response && axiosError.response.status === 404) {
			return [];
		}

		return [];
	}
};
