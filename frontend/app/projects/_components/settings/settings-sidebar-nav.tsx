"use client";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Dispatch, SetStateAction } from "react";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
	items: {
		value: string;
		title: string;
	}[];
	activeTab: string;
	setActiveTab: Dispatch<SetStateAction<"general" | "envvars" | "advanced">>;
}

export function SettingsSidebarNav({
	className,
	items,
	activeTab,
	setActiveTab,
	...props
}: SidebarNavProps) {
	return (
		<nav
			className={cn(
				"flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
				className
			)}
			{...props}
		>
			<div className="hidden lg:block">
				{items.map((item) => (
					<p
						key={item.value}
						className={cn(
							"w-52",
							buttonVariants({ variant: "ghost" }),
							activeTab === item.value
								? "bg-muted hover:bg-muted"
								: "hover:bg-transparent",
							"justify-start cursor-pointer"
						)}
						onClick={() =>
							setActiveTab(item.value as "general" | "envvars" | "advanced")
						}
					>
						{item.title}
					</p>
				))}
			</div>
			<ScrollArea className="whitespace-nowrap rounded-md border block lg:hidden">
				{items.map((item) => (
					<p
						key={item.value}
						className={cn(
							buttonVariants({ variant: "ghost" }),
							activeTab === item.value
								? "bg-muted hover:bg-muted"
								: "hover:bg-transparent",
							"justify-start cursor-pointer"
						)}
						onClick={() =>
							setActiveTab(item.value as "general" | "envvars" | "advanced")
						}
					>
						{item.title}
					</p>
				))}
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		</nav>
	);
}
