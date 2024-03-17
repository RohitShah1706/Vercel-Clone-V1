import { FC, useState } from "react";
import { UseFormReturn, FieldValues } from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";

interface FormInputWithOverrideProps<T extends FieldValues> {
	form: UseFormReturn<T>;
	name: string;
	placeholder: string;
	label: string;
}

export const FormInputWithOverride: FC<FormInputWithOverrideProps<any>> = ({
	form,
	name,
	placeholder,
	label,
}) => {
	const [disabled, setDisabled] = useState(true);

	return (
		<div className="flex gap-4">
			<div className="w-full">
				<FormField
					disabled={disabled}
					control={form.control}
					name={name}
					render={({ field }) => (
						<FormItem className="px-1">
							<FormLabel>{label}</FormLabel>
							<FormControl>
								<Input placeholder={placeholder} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<div className="flex items-center gap-2 mt-6">
				<p className="text-sm font-[500] hidden sm:block">OVERRIDE</p>
				<Switch
					checked={!disabled}
					onCheckedChange={() => {
						setDisabled((prev) => !prev);
					}}
					aria-readonly
				/>
			</div>
		</div>
	);
};
