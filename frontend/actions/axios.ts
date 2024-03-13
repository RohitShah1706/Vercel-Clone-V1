import axios from "axios";

const NEXT_PUBLIC_BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export const getAxiosInstance = (accessToken: string) => {
	return axios.create({
		baseURL: NEXT_PUBLIC_BACKEND_BASE_URL,
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	}); 
};
