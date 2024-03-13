"use server";

import { AxiosError } from "axios";

import { getSession } from "./session";
import { getAxiosInstance } from "./axios";

const NEXT_PUBLIC_BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export const getDecryptedEnvVarValue = async (
	key: string,
	projectId: string
): Promise<string> => {
	const session = await getSession();
	if (!session) {
		return "";
	}

	try {
		const axiosInstance = getAxiosInstance(session.accessToken as string);
		const response = await axiosInstance.get(
			`/envvars/${projectId}?key=${key}`
		);

		return response.data.value;
	} catch (error: unknown) {
		const axiosError = error as AxiosError;
		if (axiosError.response && axiosError.response.status === 404) {
			return "";
		}

		return "";
	}
};

export const addEnvVar = async ({
	projectId,
	key,
	value,
}: {
	projectId: string;
	key: string;
	value: string;
}): Promise<"SUCCESS" | "FAILED"> => {
	const session = await getSession();
	if (!session) {
		return "FAILED";
	}

	try {
		const axiosInstance = getAxiosInstance(session.accessToken as string);
		await axiosInstance.post(`/envvars/${projectId}`, {
			key,
			value,
		});
		return "SUCCESS";
	} catch (error: unknown) {
		const axiosError = error as AxiosError;
		if (axiosError.response && axiosError.response.status === 404) {
			return "FAILED";
		}
		return "FAILED";
	}
};

export const removeEnvVar = async ({
	projectId,
	key,
}: {
	projectId: string;
	key: string;
}): Promise<"SUCCESS" | "FAILED"> => {
	const session = await getSession();
	if (!session) {
		return "FAILED";
	}

	try {
		const axiosInstance = getAxiosInstance(session.accessToken as string);
		await axiosInstance.delete(`/envvars/${projectId}?key=${key}`);

		return "SUCCESS";
	} catch (error: unknown) {
		const axiosError = error as AxiosError;
		if (axiosError.response && axiosError.response.status === 404) {
			return "FAILED";
		}
		return "FAILED";
	}
};
