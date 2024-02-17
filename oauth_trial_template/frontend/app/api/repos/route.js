import {NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";

import {options} from "../auth/[...nextauth]/options";

export async function GET(req, res) {
	const token = await getToken({
		req,
		secret: process.env.NEXTAUTH_SECRET ?? "",
	});

	// console.log("token", token);
	if (token === null) {
		return NextResponse.json(null, {
			status: 401,
		});
	}

	// fetch list of all private repos from backend
	const response = await fetch(
		`${process.env.BACKEND_BASE_URL}/private-repos`,
		{
			headers: {
				Authorization: `Bearer ${token.accessToken}`,
			},
		}
	);

	try {
		if (response.ok) {
			const data = await response.json();
			return NextResponse.json(data);
		}

		return NextResponse.error(new Error("Internal Server Error"));
	} catch (error) {
		return NextResponse.error(new Error("Internal Server Error"));
	}
}
