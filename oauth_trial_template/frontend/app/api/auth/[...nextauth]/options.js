import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

export const options = {
	providers: [
		GitHubProvider({
			clientId: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			authorization: {
				params: {
					scope: "repo user",
				},
			},
		}),
		// ! below is a custom provider for username and password
		// CredentialsProvider({
		// 	name: "Credentials",
		// 	credentials: {
		// 		username: {
		// 			label: "Username:",
		// 			type: "text",
		// 			placeholder: "Username",
		// 		},
		// 		password: {
		// 			label: "Password:",
		// 			type: "password",
		// 			placeholder: "Password",
		// 		},
		// 	},
		// 	async authorize(credentials) {
		// 		// ! obviously this should actually be a database call to check the credentials
		// 		const user = {id: "1", name: "Rohit Shah", password: "rohit123"};

		// 		if (
		// 			credentials.username === user.name &&
		// 			credentials.password === user.password
		// 		) {
		// 			return user;
		// 		} else {
		// 			return null;
		// 		}
		// 	},
		// }),
	],
	session: {
		strategy: "jwt", // <-- make sure to use jwt here
		// maxAge: 30 * 24 * 60 * 60,
		maxAge: 60 * 60 * 1, // ! one hour
	},
	callbacks: {
		jwt: async ({token, user, account}) => {
			if (account && account.access_token) {
				token.accessToken = account.access_token; // <-- adding the access_token here
			}
			return token;
		},
	},
};
