const {Octokit} = require("@octokit/rest");

const authenticateGithub = async (req, res, next) => {
	const accessToken = req.headers.authorization; // Retrieve from headers or use cookies

	if (!accessToken) {
		return res.status(401).json({error: "Unauthorized"});
	}

	// ! Validate and verify the access token
	try {
		const octokit = new Octokit({auth: accessToken});
		await octokit.users.getAuthenticated();

		req.accessToken = accessToken;
		next();
	} catch (error) {
		// console.error("Error validating access token:", error.message);
		res.status(401).json({error: "Unauthorized"});
	}
};

module.exports = {
	authenticateGithub,
};
