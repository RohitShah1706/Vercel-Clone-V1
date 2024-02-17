"use client";

import {useState, useEffect} from "react";

const RepoList = () => {
	const [repoLength, setRepoLength] = useState(0);
	const [repos, setRepos] = useState([]);

	useEffect(() => {
		fetch("/api/repos")
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				// console.log("data", data);
				if (data === null) {
					return;
				}
				setRepoLength(data.length);
				setRepos(data);
			});
	}, []);

	return (
		<div>
			<h1>RepoList Length {repoLength}</h1>
			{repos &&
				repos.map((repo) => {
					return (
						<div key={repo.id}>
							<h3>{repo.name}</h3>
							<p>{repo.description}</p>
						</div>
					);
				})}
		</div>
	);
};

export default RepoList;
