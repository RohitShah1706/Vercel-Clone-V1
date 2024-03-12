"use server";

import axios, { AxiosError } from "axios";

import { Project } from "@/app/types";
import { getSession } from "./session";

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
		const response = await axios.get(
			`${NEXT_PUBLIC_BACKEND_BASE_URL}/envvars/${projectId}?key=${key}`,
			{
				headers: {
					Authorization: `Bearer ${session.accessToken}`,
				},
			}
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
		await axios.post(
			`${NEXT_PUBLIC_BACKEND_BASE_URL}/envvars/${projectId}`,
			{
				key,
				value,
			},
			{
				headers: {
					Authorization: `Bearer ${session.accessToken}`,
				},
			}
		);
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
		await axios.delete(
			`${NEXT_PUBLIC_BACKEND_BASE_URL}/envvars/${projectId}?key=${key}`,
			{
				headers: {
					Authorization: `Bearer ${session.accessToken}`,
				},
			}
		);
		return "SUCCESS";
	} catch (error: unknown) {
		const axiosError = error as AxiosError;
		if (axiosError.response && axiosError.response.status === 404) {
			return "FAILED";
		}
		return "FAILED";
	}
};
