import express from "express";
import httpProxy from "http-proxy";

import {AWS_S3_BASE_URL, AWS_S3_BUCKET_NAME} from "./config";

const proxy = httpProxy.createProxy();
const app = express();

const BASE_PATH = `${AWS_S3_BASE_URL}`;

app.get("/404/*", async (req, res) => {
	const Key = "";

	const resolvesTo = `${BASE_PATH}/${Key}`;
	// console.log(`Key ${Key} resolves to ${resolvesTo}`);

	return proxy.web(req, res, {
		target: resolvesTo,
		changeOrigin: true,
	});
});

app.get("/:id/*", async (req, res) => {
	const id = req.params.id;
	const Key = "dist";

	const resolvesTo = `${BASE_PATH}/${Key}`;
	// console.log(`Key ${Key} resolves to ${resolvesTo}`);

	return proxy.web(req, res, {
		target: resolvesTo,
		changeOrigin: true,
	});
});

app.get("/*", (req, res) => {
	res.redirect("/404/");
});

// ! event emitted just before proxying request to target server
proxy.on("proxyReq", (proxyReq, req, res) => {
	const url = req.url;

	if (url?.split("/")[2] === "") {
		// ! users could also request at /<id>/ instead of /<id>/index.html
		proxyReq.path += "index.html";
	}

	// console.log("proxying request to:", `${BASE_PATH}${proxyReq.path}`);
});

// ! event emitted just before proxying response to client
proxy.on("proxyRes", (proxyRes, req, res) => {
	if (proxyRes.statusCode === 404) {
		// ! 302 - Redirect
		res.writeHead(302, {
			location: "/404/",
		});
		res.end();
	}
});

const PORT = 8080;

const startServer = async () => {
	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});
};

startServer();
