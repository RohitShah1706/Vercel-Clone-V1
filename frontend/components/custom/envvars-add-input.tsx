import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export const EnvVarsAddInput = ({
	newKey,
	setNewKey,
	newValue,
	setNewValue,
	handleAddEnvVar,
	isLoading,
}: {
	newKey: string;
	setNewKey: Dispatch<SetStateAction<string>>;
	newValue: string;
	setNewValue: Dispatch<SetStateAction<string>>;
	handleAddEnvVar: () => Promise<void>;
	isLoading: boolean;
}) => {
	return (
		<div className="flex flex-col items-center gap-6">
			<div className="flex gap-4 items-center w-full">
				<div className="w-full sm:w-[90%] flex gap-2">
					<div className="w-full flex flex-col gap-2">
						<Label htmlFor="envVarKey">Key</Label>
						<Input
							type="text"
							id="envVarKey"
							placeholder="EXAMPLE_NAME"
							className="w-full"
							value={newKey}
							onChange={(e) => setNewKey(e.target.value)}
						/>
					</div>

					<div className="w-full flex flex-col gap-2">
						<Label htmlFor="envVarValue">
							<p className="hidden sm:block">Value (Will Be Encrypted)</p>
							<p className="block sm:hidden">Value</p>
						</Label>
						<Input
							type="text"
							id="envVarValue"
							placeholder="I9JU23NF39R6HH"
							className="w-full"
							value={newValue}
							onChange={(e) => setNewValue(e.target.value)}
						/>
					</div>
				</div>
				<div className="hidden sm:block mt-[19.1px]">
					<Button
						type="button"
						variant="secondary"
						className="px-5"
						onClick={handleAddEnvVar}
						disabled={isLoading}
					>
						Add
					</Button>
				</div>
			</div>
			<Button
				type="button"
				variant="secondary"
				className="block sm:hidden w-full"
				onClick={handleAddEnvVar}
				disabled={isLoading}
			>
				Add
			</Button>
		</div>
	);
};
