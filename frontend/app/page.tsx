import { getServerSession } from "next-auth";
import { Features } from "./_components/features";
import { Hero } from "./_components/hero";

import { options } from "@/app/api/auth/[...nextauth]/options";

export default async function Home() {
	const session = await getServerSession(options);
	console.log(session);
	return (
		<>
			<Hero />
			<Features />
		</>
	);
}
