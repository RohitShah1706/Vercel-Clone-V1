import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/select";
import { Dispatch, SetStateAction } from "react";

export const SelectActiveTab = ({
	activeTab,
	setActiveTab,
}: {
	activeTab: "project" | "deployments" | "settings";
	setActiveTab: Dispatch<
		SetStateAction<"project" | "deployments" | "settings">
	>;
}) => {
	return (
		<Select
			onValueChange={(value) => {
				setActiveTab(value as "project" | "deployments" | "settings");
			}}
		>
			<SelectTrigger>{activeTab}</SelectTrigger>
			<SelectContent>
				<SelectItem value="project" className="text-xs md:text-sm">
					Project
				</SelectItem>
				<SelectItem value="deployments" className="text-xs md:text-sm">
					Deployments
				</SelectItem>
				<SelectItem value="settings" className="text-xs md:text-sm">
					Settings
				</SelectItem>
			</SelectContent>
		</Select>
	);
};
