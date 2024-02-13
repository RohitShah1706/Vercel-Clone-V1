export const getFileType = (filePath: string) => {
	const type = filePath.endsWith(".html")
		? "text/html"
		: filePath.endsWith(".css")
		? "text/css"
		: filePath.endsWith(".js")
		? "application/javascript"
		: filePath.endsWith(".svg")
		? "image/svg+xml"
		: filePath.endsWith(".png")
		? "image/png"
		: filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")
		? "image/jpeg"
		: filePath.endsWith(".gif")
		? "image/gif"
		: "text/plain"; // Default MIME type

	return type;
};
