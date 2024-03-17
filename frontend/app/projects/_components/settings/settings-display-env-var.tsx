"use client";

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import { getDecryptedEnvVarValue } from "@/actions/envvars";
import { Button } from "@/components/ui/button";
import { Check, Copy, Dot, Eye, EyeOff, MinusCircle } from "lucide-react";
import { useState } from "react";

export const SettingsDisplayEnvVar = ({
	projectId,
	envVarKey,
	handleRemoveEnvVar,
	isLoading,
}: {
	projectId: string;
	envVarKey: string;
	handleRemoveEnvVar: (key: string) => void;
	isLoading: boolean;
}) => {
	const [displayValue, setDisplayValue] = useState(false);
	const [envVarValue, setEnvVarValue] = useState<string>("");
	const [valueCopied, setValueCopied] = useState(false);

	const toggleDisplayValue = async () => {
		if (!displayValue) {
			if (envVarValue === "") {
				const value = await getDecryptedEnvVarValue(envVarKey, projectId);
				setEnvVarValue(value);
			}
		}
		setDisplayValue(!displayValue);
	};

	return (
		<div className="flex gap-4 items-center w-full">
			<div className="w-[82%] sm:w-[92%] flex gap-2">
				<div className="w-full border rounded-md bg-[#FCFDFD] dark:bg-[#050505] flex items-center">
					<p className="text-sm text-muted-foreground px-3">{envVarKey}</p>
				</div>

				<div className="w-full border rounded-md bg-[#FCFDFD] dark:bg-[#050505]">
					{displayValue ? (
						<div className="flex items-center gap-2">
							<Button variant="outline" size="sm" onClick={toggleDisplayValue}>
								<EyeOff className="w-4 h-4" />
							</Button>
							<p className="text-sm text-muted-foreground cursor-pointer">
								<Dialog
									onOpenChange={(open) => {
										if (!open) {
											setValueCopied(false);
										}
									}}
								>
									<DialogTrigger asChild>
										<p>{envVarValue}</p>
									</DialogTrigger>
									<DialogContent className="sm:max-w-md">
										<DialogHeader>
											<DialogTitle>Decrypted Value</DialogTitle>
											<DialogDescription>
												Click on the copy icon to copy to clipboard.
											</DialogDescription>
										</DialogHeader>
										<div className="flex items-center space-x-2">
											<div className="grid flex-1 gap-2">
												<p className="overflow-hidden truncate">
													{envVarValue}
												</p>
											</div>
											{valueCopied ? (
												<Button
													type="submit"
													size="sm"
													className="px-3"
													onClick={() => {
														setValueCopied(false);
													}}
												>
													<Check className="h-4 w-4" />
												</Button>
											) : (
												<Button
													type="submit"
													size="sm"
													className="px-3"
													onClick={async () => {
														await navigator.clipboard.writeText(envVarValue);
														setValueCopied(true);
													}}
												>
													<Copy className="h-4 w-4" />
												</Button>
											)}
										</div>
										<DialogFooter className="sm:justify-start">
											<DialogClose asChild>
												<Button type="button" variant="secondary">
													Close
												</Button>
											</DialogClose>
										</DialogFooter>
									</DialogContent>
								</Dialog>
							</p>
						</div>
					) : (
						<div className="flex items-center gap-2">
							<Button variant="outline" size="sm" onClick={toggleDisplayValue}>
								<Eye className="w-4 h-4" />
							</Button>
							<p className="flex items-center gap-0 text-sm text-muted-foreground overflow-hidden truncate">
								{Array.from({ length: 12 }).map((_, index) => (
									<Dot key={index} className="w-4 h-4 -mr-3" />
								))}
							</p>
						</div>
					)}
				</div>
			</div>
			<Button
				type="button"
				variant="secondary"
				className="sm:px-4"
				onClick={() => {
					handleRemoveEnvVar(envVarKey);
				}}
				disabled={isLoading}
			>
				<MinusCircle className="w-4 h-4" />
			</Button>
		</div>
	);
};
