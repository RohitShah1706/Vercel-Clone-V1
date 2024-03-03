import Image from "next/image";
import Link from "next/link";
import React from "react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink } from "lucide-react";
import { ThemeModeToggle } from "./theme-mode-toggle";

export const Navbar = () => {
	return (
		<nav className="fixed w-full bg-white border-gray-200 dark:bg-[#0f0f0f] px-2">
			<div className="max-w-screen-4xl flex flex-wrap items-center justify-between mx-auto p-2 mt-1">
				<Link
					href="/"
					className="flex items-center space-x-3 rtl:space-x-reverse"
				>
					{/* TODO: update with dark and light themed logos here */}
					<Image src="/next.svg" alt="logo" width="8" height="8" />
					<span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
						Vercel
					</span>
					{/* TODO: add username or email id here */}
				</Link>

				<DropdownMenu>
					<DropdownMenuTrigger>
						<Avatar className="w-8 h-8">
							<AvatarImage src="https://github.com/shadcn.png" />
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-48 dark:text-gray-300">
						<DropdownMenuItem className="text-xs">
							{"rlshah03@gmail.com"}
						</DropdownMenuItem>
						<DropdownMenuItem className="text-xs">
							<Link href="/dashboard">Dashboard</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />

						<DropdownMenuItem className="text-xs flex items-center justify-between">
							Command Menu
							<kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
								<span className="text-xs">Ctrl K</span>
							</kbd>
						</DropdownMenuItem>
						<DropdownMenuItem className="text-xs flex items-center justify-between">
							Theme <ThemeModeToggle />
						</DropdownMenuItem>
						<DropdownMenuSeparator />

						<DropdownMenuItem className="text-xs flex items-center justify-between">
							Vercel Homepage <ExternalLink className="w-4 h-4" />
						</DropdownMenuItem>
						<DropdownMenuItem className="text-xs">Logout</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</nav>
	);
};
