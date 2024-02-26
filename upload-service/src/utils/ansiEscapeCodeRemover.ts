export const removeAnsiEscapeCodes = (inputString: string) => {
	// Regex to match ANSI escape codes
	const ansiRegex = /\x1B\[[0-9;]*[JKmsu]/g;

	// Remove ANSI escape codes
	return inputString.replace(ansiRegex, "");
};
