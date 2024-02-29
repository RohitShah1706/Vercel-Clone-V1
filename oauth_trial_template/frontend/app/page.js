import {getServerSession} from "next-auth";
import Image from "next/image";

import RepoList from "./_components/RepoList";

export default async function Home(req) {
	const session = await getServerSession();
	// console.log("session home", session);

	return (
		<>
			getServerSession result
			{session?.user?.name ? (
				<div>{session.user.name}</div>
			) : (
				<div>Not logged in</div>
			)}
			<div>
				<h1>List of private repositories</h1>
				<br />
				<button>Get list of private repositories</button>
				{/* <RepoList /> */}
			</div>
		</>
	);
}
