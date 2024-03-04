import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { options } from "../auth/[...nextauth]/options";

export async function GET(req, res) {
	const token = await getToken({
		req,
		secret: process.env.NEXTAUTH_SECRET ?? "",
	});

	// ! to demonstrate that server session is available to all server-side routes
	const session = await getServerSession(options);

	console.log("session", session);
	// console.log("token", token);

	return NextResponse.json({
		name: session?.user?.name ?? "Not Logged In",
	});
}
