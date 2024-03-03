"use client";

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
import { ExternalLink, SettingsIcon } from "lucide-react";
import { ThemeModeToggle } from "./theme-mode-toggle";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { redirect } from "next/navigation";

interface User {
	name?: string | null | undefined;
	email?: string | null | undefined;
	image?: string | null | undefined;
}

interface UserDropdownMenuProps {
	user: User;
}

const UserDropdownMenu: React.FC<UserDropdownMenuProps> = ({ user }) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Avatar className="w-8 h-8 md:w-10 md:h-10">
					{user?.image && <AvatarImage src={user?.image} />}
					{user?.name && !user?.image && (
						<AvatarFallback>{user.name[0]}</AvatarFallback>
					)}
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-52 dark:text-gray-300">
				<DropdownMenuItem className="text-xs md:text-sm">
					{user.email}
				</DropdownMenuItem>
				<DropdownMenuItem className="text-xs md:text-sm">
					<Link href="/dashboard">Dashboard</Link>
				</DropdownMenuItem>
				<DropdownMenuItem className="text-xs md:text-sm">
					<Link
						href="/settings"
						className="flex items-center justify-between w-full"
					>
						Settings <SettingsIcon className="w-4 h-4 md:w-5 md:h-5" />
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />

				<DropdownMenuItem className="text-xs md:text-sm flex items-center justify-between">
					Menu
					<kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
						<span className="text-xs md:text-sm">Ctrl K</span>
					</kbd>
				</DropdownMenuItem>
				<DropdownMenuSeparator />

				<DropdownMenuItem className="text-xs md:text-sm">
					<Link href="/" className="flex items-center justify-between w-full">
						Vercel Homepage <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
					</Link>
				</DropdownMenuItem>

				<DropdownMenuItem
					className="text-xs md:text-sm cursor-pointer"
					onClick={() => {
						console.log("Logging out");
						signOut();
					}}
				>
					Logout
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export const Navbar = () => {
	const { data: session } = useSession();

	return (
		<nav className="sticky top-0 w-full border-b border-gray-200 dark:border-gray-900 bg-[#FEFFFE] dark:bg-[#0B0B0A] z-10">
			<div className="container flex flex-wrap items-center justify-between p-3">
				<Link
					href="/"
					className="flex items-center space-x-3 rtl:space-x-reverse"
				>
					<div className="block dark:hidden">
						<Image src="/vercel.svg" alt="github" width={32} height={32} />
					</div>
					<div className="hidden dark:block">
						<Image
							src="/vercel-white.svg"
							alt="github"
							width={32}
							height={32}
						/>
					</div>
					<span className="hidden sm:block self-center sm:text-3xl md:text-4xl font-semibold whitespace-nowrap dark:text-white text-black">
						Vercel
					</span>
				</Link>
				<div className="flex items-center gap-2">
					<ThemeModeToggle />
					{session?.user ? (
						<UserDropdownMenu user={session.user} />
					) : (
						<div className="flex items-center gap-2">
							<Button onClick={() => signIn("github")}>Log In</Button>

							<Button onClick={() => signIn("github")} variant="outline">
								Sign Up
							</Button>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
};
