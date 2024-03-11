"use client";

import { Spinner } from "@/components/custom/spinner";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ImportSideDetails } from "./_components/import-side-details";
import { ConfigureProjectCard } from "./_components/configure-project-card";

export default function ImportRepoAndDeployPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const s = searchParams.get("src");
	const pname = searchParams.get("project-name");
	const branch = searchParams.get("branch");

	const [src, setSrc] = useState(s);

	useEffect(() => {
		if (!s || !pname || !branch) {
			router.push("/dashboard");
		}
	}, [s, pname, branch, router]);

	if (!s || !pname) {
		<div className="flex items-center justify-center min-h-screen">
			<Spinner size={"ultra"} />
		</div>;
	}

	return (
		<div className="mx-auto max-w-full px-4 lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl flex flex-col">
			<div className="mt-16 mb-16">
				<div className="container"></div>
				<h1 className="text-[40px] font-bold mb-2 leading-[50px]">{`You're almost done.`}</h1>
				<p className="text-gray-600 dark:text-gray-300">
					Please follow the steps to configure your Project and deploy it.
				</p>
			</div>

			<div className="flex space-x-4">
				<div className="w-1/3 hidden lg:block">
					<ImportSideDetails projectName={pname} src={src} branch={branch} />
				</div>
				<div className="w-full lg:w-2/3">
					<ConfigureProjectCard projectName={pname} src={src} />
				</div>
			</div>
		</div>
	);
}
