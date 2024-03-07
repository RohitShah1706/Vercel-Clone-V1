import Image from "next/image";
import { ArrowRight, GitBranch } from "lucide-react";
import Link from "next/link";

export const ImportSideDetails = ({
	projectName,
	src,
	branch,
}: {
	projectName: string | null;
	src: string | null;
	branch: string | null;
}) => {
	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center gap-2 bg-[#EBEAEB] dark:bg-[#333333] p-4 rounded-lg w-[288px]">
				<div className="block dark:hidden">
					<Image src="/github.svg" alt="github" width={30} height={30} />
				</div>
				<div className="hidden dark:block">
					<Image src="/github-white.svg" alt="github" width={30} height={30} />
				</div>
				<p className="font-medium overflow-auto whitespace-normal break-all">
					{projectName}
				</p>
			</div>

			<hr className="border-t border-accents-2 mr-16" />

			<div className="flex flex-col gap-2">
				<h1 className="font-[500] text-[12px] dark:text-[#FAFBFB] text-[#000101] mb-2">
					GIT REPOSITORY
				</h1>

				<Link
					className="flex items-center gap-2"
					href={`https://github.com/${src}`}
					target="_blank"
				>
					<div className="block dark:hidden">
						<Image src="/github.svg" alt="github" width={20} height={20} />
					</div>
					<div className="hidden dark:block">
						<Image
							src="/github-white.svg"
							alt="github"
							width={20}
							height={20}
						/>
					</div>
					<p className="font-medium text-[14px]">{src}</p>
				</Link>

				<p className="flex items-center gap-3">
					<GitBranch className="w-4 h-4" />
					{branch}
				</p>
			</div>

			<hr className="border-t border-accents-2 mr-16" />
			<a href="" className="flex items-center gap-2">
				Import a different Git Repository
				<ArrowRight className="w-4 h-4" />
			</a>
		</div>
	);
};
