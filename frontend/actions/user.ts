"use server";

import { AxiosError } from "axios";

import { User } from "@/types";
import { getSession } from "./session";
import { getAxiosInstance } from "./axios";

const NEXT_PUBLIC_BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export const getOrCreateUser = async (): Promise<User | null> => {
	const session = await getSession();
	if (!session) {
		return null;
	}

	try {
		const axiosInstance = getAxiosInstance(session.accessToken as string);
		const response = await axiosInstance.get("/users");

		return response.data;
	} catch (error: unknown) {
		const axiosError = error as AxiosError;
		if (axiosError.response && axiosError.response.status === 404) {
			try {
				const axiosInstance = getAxiosInstance(session.accessToken as string);
				const response = await axiosInstance.post("/users", {
					email: session.user?.email,
				});

				return response.data.user;
			} catch (error) {
				return null;
			}
		}

		return null;
	}
};
