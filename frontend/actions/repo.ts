"use server";

import axios, { AxiosError } from "axios";

import { Repository, RepositoryVisibility } from "@/app/types";
import { getSession } from "./session";

const NEXT_PUBLIC_BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export const getRepositories = async (
	visibility: RepositoryVisibility
): Promise<Repository[]> => {
	const session = await getSession();
	if (!session) {
		return [];
	}

	try {
		const response = await axios.get(
			`${NEXT_PUBLIC_BACKEND_BASE_URL}/repos?visibility=${visibility}`,
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
