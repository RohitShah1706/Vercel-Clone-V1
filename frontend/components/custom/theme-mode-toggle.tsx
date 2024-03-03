"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export const ThemeModeToggle = () => {
	const { theme, setTheme } = useTheme();

	return (
		<div>
			<Select
				onValueChange={(value) => {
					setTheme(value);
				}}
			>
				<SelectTrigger className="h-8">
					{/* <SelectValue placeholder="System" />
					 */}
					<Sun className="mr-1 h-4 w-4 block dark:hidden" />
					<Moon className="mr-1 h-4 w-4 hidden dark:block" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="light">Light</SelectItem>
					<SelectItem value="dark">Dark</SelectItem>
					<SelectItem value="system">System</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
};
