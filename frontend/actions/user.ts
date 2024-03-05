"use server";

import axios, { AxiosError } from "axios";

import { User } from "@/app/types";
import { getSession } from "./session";

const NEXT_PUBLIC_BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export const getOrCreateUser = async (): Promise<User | null> => {
	const session = await getSession();
	if (!session) {
		return null;
	}

	try {
		const response = await axios.get(`${NEXT_PUBLIC_BACKEND_BASE_URL}/users`, {
			headers: {
				Authorization: `Bearer ${session.accessToken}`,
			},
		});
		return response.data;
	} catch (error: unknown) {
		const axiosError = error as AxiosError;
		if (axiosError.response && axiosError.response.status === 404) {
			try {
				const response = await axios.post(
					`${NEXT_PUBLIC_BACKEND_BASE_URL}/users`,
					{
						email: session.user?.email,
					},
					{
						headers: {
							Authorization: `Bearer ${session.accessToken}`,
						},
					}
				);

				return response.data.user;
			} catch (error) {
				return null;
			}
		}

		return null;
	}
};
