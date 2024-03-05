import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonCard = () => {
	return (
		<div className="w-full bg-[#FAFBFB] dark:bg-[#000101] flex items-center justify-between py-4 px-4 gap-2 border">
			<div className="flex items-center gap-2">
				<Skeleton className="w-24 sm:w-40 md:w-64 lg:w-80 xl:w-[420px] h-8" />
			</div>
			<Skeleton className="w-16 h-8" />
		</div>
	);
};
