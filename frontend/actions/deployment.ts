"use server";

import { AxiosError } from "axios";

import { Deployment, DeploymentStatus } from "@/types";
import { getSession } from "./session";
import { getAxiosInstance } from "./axios";

export const getDeployments = async (
	projectId: string
): Promise<Deployment[]> => {
	const session = await getSession();

	if (!session) {
		return [];
	}

	try {
		const axiosInstance = getAxiosInstance(session.accessToken as string);
		const response = await axiosInstance.get(`/deployments/all/${projectId}`);

		return response.data;
	} catch (error: unknown) {
		const axiosError = error as AxiosError;
		if (axiosError.response && axiosError.response.status === 404) {
			return [];
		}

		return [];
	}
};

export const getDeploymentStatus = async (
	deploymentId: string
): Promise<DeploymentStatus> => {
	const session = await getSession();

	if (!session) {
		return DeploymentStatus.FAILED;
	}

	try {
		const axiosInstance = getAxiosInstance(session.accessToken as string);
		const response = await axiosInstance.get(
			`/deployments/status?id=${deploymentId}`
		);

		return response.data.status as DeploymentStatus;
	} catch (error: unknown) {
		const axiosError = error as AxiosError;
		if (axiosError.response && axiosError.response.status === 404) {
			return DeploymentStatus.FAILED;
		}

		return DeploymentStatus.FAILED;
	}
};

export const getDeploymentInfo = async (
	deploymentId: string
): Promise<Deployment | null> => {
	const session = await getSession();

	if (!session) {
		return null;
	}

	try {
		const axiosInstance = getAxiosInstance(session.accessToken as string);
		const response = await axiosInstance.get(`/deployments/${deploymentId}`);

		return response.data;
	} catch (error: unknown) {
		const axiosError = error as AxiosError;
		if (axiosError.response && axiosError.response.status === 404) {
			return null;
		}

		return null;
	}
};

export const createDeployment = async ({
	commitId,
	branch,
	projectId,
}: {
	commitId: string;
	branch: string;
	projectId: string;
}): Promise<Deployment | null> => {
	const session = await getSession();
	if (!session) {
		return null;
	}

	try {
		const axiosInstance = getAxiosInstance(session.accessToken as string);
		const response = await axiosInstance.post(`/deployments/deploy`, {
			projectId,
			branch,
			commitId,
		});

		return response.data;
	} catch (error: unknown) {
		const axiosError = error as AxiosError;
		if (axiosError.response && axiosError.response.status === 404) {
			return null;
		}
		return null;
	}
};
