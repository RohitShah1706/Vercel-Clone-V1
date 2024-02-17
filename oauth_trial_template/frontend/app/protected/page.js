import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";

const page = async () => {
	const session = await getServerSession();

	if (!session || !session.user) {
		redirect("/api/auth/signin");
	}

	return (
		<div>
			This is a protected route.
			<br />
			You will only see if you are authenticated.
		</div>
	);
};

export default page;
