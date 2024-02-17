const express = require("express");
const {Octokit} = require("@octokit/rest");

const {authenticateGithub} = require("./middlewares");

const app = express();
const PORT = 5050;

app.use(express.json());
app.use(authenticateGithub);

app.get("/private-repos", async (req, res) => {
	const octokit = new Octokit({auth: req.accessToken});

	try {
		const {data} = await octokit.repos.listForAuthenticatedUser({
			visibility: "private",
		});

		res.json(data);
	} catch (error) {
		res.status(500).json({error: "Internal Server Error"});
	}
});

app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});
