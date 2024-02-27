import {Router} from "express";
import {z} from "zod";
import {Octokit} from "@octokit/rest";
import {authenticateGithub} from "../middlewares";

interface Repo {
	name: string;
	full_name: string;
	updated_at: string;
	clone_url: string;
	visibility: string;
	default_branch: string;
	last_commit_id: string | null;
}

const router = Router();
router.get("/", authenticateGithub, async (req, res) => {
	const VisibilityEnum = z.enum(["all", "private", "public"]);

	const parsed = VisibilityEnum.safeParse(req.query.visibility);
	if (!parsed.success) {
		return res.status(400).json({
			error: {
				visibility:
					"Invalid value. Expected one of ['all', 'private', 'public']",
			},
		});
	}

	let visibility = parsed.data;

	const octokit = new Octokit({auth: res.locals.accessToken});
	// console.log("Fetching repositories with visibility:", visibility);
	try {
		let page = 1;
		let fetchMore = true;
		let allRepos: Repo[] = [];

		while (fetchMore) {
			try {
				const {data} = await octokit.repos.listForAuthenticatedUser({
					visibility: visibility as "all" | "private" | "public",
					per_page: 100,
					page: page,
				});

				const repos: Repo[] = await Promise.all(
					data.map(async (repo: any) => {
						let lastCommitSha = null;
						try {
							const commits = await octokit.repos.listCommits({
								owner: repo.owner.login,
								repo: repo.name,
								per_page: 1,
							});
							if (commits.data.length > 0) {
								lastCommitSha = commits.data[0].sha;
							}
						} catch (error) {
							console.error(`Failed to get commits for ${repo.full_name}`);
						}

						return {
							name: repo.name,
							full_name: repo.full_name,
							updated_at: repo.updated_at,
							clone_url: repo.clone_url,
							visibility: repo.visibility,
							default_branch: repo.default_branch,
							last_commit_id: lastCommitSha,
						};
					})
				);

				allRepos = [...allRepos, ...repos];
				if (data.length < 100) {
					fetchMore = false;
				} else {
					page++;
				}
			} catch (error) {
				return res.status(500).json({error: "Error fetching repositories"});
			}
		}

		// sort allRepos by updated_at
		allRepos.sort((a, b) => {
			const dateA = new Date(a.updated_at).getTime();
			const dateB = new Date(b.updated_at).getTime();
			return dateB - dateA;
		});

		res.json(allRepos);
	} catch (error) {
		res.status(500).json({error: "Internal Server Error"});
	}
});

export default router;
