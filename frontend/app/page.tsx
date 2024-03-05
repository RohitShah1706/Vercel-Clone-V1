import { getOrCreateUser } from "@/actions/user";
import { Features } from "./_components/features";
import { Hero } from "./_components/hero";

export default async function Home() {
	const user = await getOrCreateUser();
	return (
		<>
			<Hero />
			<Features />
		</>
	);
}
