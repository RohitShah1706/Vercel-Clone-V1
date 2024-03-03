import GitHubProvider from "next-auth/providers/github";
import { NextAuthOptions } from "next-auth";

export const options: NextAuthOptions = {
	providers: [
		GitHubProvider({
			clientId: process.env.GITHUB_CLIENT_ID || "",
			clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
			// ! IMP: used to set the scope of the access token
			// ! below will provide complete access to all repos
			authorization: {
				params: {
					scope: "repo user",
				},
			},
		}),
	],
	session: {
		// ! IMP: session data is stored directly in a JWT token
		strategy: "jwt",
		maxAge: 60 * 60 * 1, // ! one hour
	},
	callbacks: {
		jwt: async ({ token, user, account }) => {
			if (account && account.access_token) {
				token.accessToken = account.access_token;
			}
			return token;
		},
	},
};
