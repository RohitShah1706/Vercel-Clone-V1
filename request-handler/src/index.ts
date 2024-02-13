import express from "express";

import {getObject} from "./aws";
import {getFileType} from "./file";

const app = express();

app.get("/:id/*", async (req, res) => {
	// ! NOTE: idea here it to capture "id" of build from subdomain
	// Example: `https://<id>.vercel-clone.com` - so host will be `<id>.vercel-clone.com`
	// const id = req.hostname.split(".")[0];
	// const filePath = req.path;
	// const Key = `dist/${id}${filePath}`;
	// since, we don't have access to a domain, we can't create subdomains
	// so for now we will extract "id" from /:id
	// ! NOTE: if we follow subdomain method app.get("/:id/*") changes to app.get("/*")

	const id = req.params.id;
	const filePath = (req.params as {[key: string]: string})["0"];
	const Key = `dist/${id}/${filePath}`;

	const contents = await getObject(Key);
	if (contents === null) {
		res.status(404).send("File not found");
		return;
	}

	const type = getFileType(filePath);

	// ! do this so in browser we don't download file when we request but instead tell browser to render it
	res.setHeader("Content-Type", type);
	res.send(contents);
});

const PORT = 8080;

const startServer = async () => {
	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});
};

startServer();
