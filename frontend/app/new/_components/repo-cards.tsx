import { Repository } from "@/app/types";
import { Button } from "@/components/ui/button";
import { formatDate } from "date-fns";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export const RepoCard = ({ repo }: { repo: Repository }) => {
	const router = useRouter();
	return (
		<div className="w-full bg-[#FAFBFB] dark:bg-[#000101] flex items-center justify-between py-4 px-4 gap-2 border">
			<div className="flex items-center gap-2">
				<p className="max-w-[130px] sm:max-w-sm md:max-w-md overflow-hidden text-ellipsis">
					{repo.name}
				</p>

				{repo.visibility === "private" && <Lock className="w-4 h-4" />}
				<p className="hidden md:block">{`${formatDate(
					new Date(repo.updated_at),
					"dd"
				)}d ago`}</p>
			</div>
			<Button
				size="sm"
				onClick={() => {
					router.push(
						`/new/import?src=${repo.full_name}&project-name=${repo.name}&branch=${repo.default_branch}`
					);
				}}
			>
				Import
			</Button>
		</div>
	);
};
