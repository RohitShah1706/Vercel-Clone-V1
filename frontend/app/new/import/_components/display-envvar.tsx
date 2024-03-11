import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MinusCircle } from "lucide-react";

export const DisplayEnvVar = ({
	envVarValue,
	envVarKey,
	handleRemoveEnvVar,
}: {
	envVarKey: string;
	envVarValue: string;
	handleRemoveEnvVar: (key: string) => void;
}) => {
	return (
		<div className="flex gap-4 items-center w-full">
			<div className="w-full sm:w-[92%] flex gap-2">
				<Input
					type="text"
					id="envDisplayKey"
					placeholder={envVarKey}
					className="w-full"
					disabled
				/>

				<Input
					type="text"
					id="envDisplayValue"
					placeholder={envVarValue}
					className="w-full"
					disabled
				/>
			</div>
			<Button
				type="button"
				variant="secondary"
				className="px-4"
				onClick={() => {
					handleRemoveEnvVar(envVarKey);
				}}
			>
				<MinusCircle className="w-4 h-4" />
			</Button>
		</div>
	);
};
