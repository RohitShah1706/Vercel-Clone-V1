import {Request, Response, NextFunction} from "express";
import {Octokit} from "@octokit/rest";

// ! Extend the "Request" interface with an "accessToken" property
// declare module "express-serve-static-core" {
// 	interface Request {
// 		accessToken: string;
// 	}
// 	// interface ResponseLocals {
// 	// 	accessToken: string;
// 	// 	emailId: string;
// 	// }
// }

const authenticateGithub = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const accessToken = req.headers.authorization;

	if (!accessToken) {
		return res.status(401).json({error: "Unauthorized"});
	}

	// ! Validate and verify the access token
	try {
		const octokit = new Octokit({auth: accessToken});
		const authenticatedUser =
			await octokit.users.listEmailsForAuthenticatedUser();
		var emailId = "";
		authenticatedUser.data.forEach((email: any) => {
			if (email.primary) {
				emailId = email.email;
			}
		});
		res.locals.accessToken = accessToken;
		res.locals.emailId = emailId;
		next();
	} catch (error) {
		// console.error("Error validating access token:", error.message);
		res.status(401).json({error: "Unauthorized"});
	}
};

export {authenticateGithub};
