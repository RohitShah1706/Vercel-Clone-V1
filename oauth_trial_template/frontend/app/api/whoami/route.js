import {getServerSession} from "next-auth";
import {NextResponse} from "next/server";

import {options} from "../auth/[...nextauth]/options";

export async function GET() {
	// ! to demonstrate that server session is available to all server-side routes
	const session = await getServerSession(options);

	// get the access token from the session
	const accessToken = session;
	console.log("session", accessToken);

	return NextResponse.json({
		name: session?.user?.name ?? "Not Logged In",
	});
}
