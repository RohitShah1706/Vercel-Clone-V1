import { Fira_Code } from "next/font/google";

const firaCode = Fira_Code({ subsets: ["latin"] });

const page = () => {
	const logs = [
		{
			log: "Building project 6a628d67-3d5c-4e42-a93a-cfa2866123be",
			timestamp: "2024-02-26T17:59:31.647Z",
		},
		{
			log: "envVars saved for id: 6a628d67-3d5c-4e42-a93a-cfa2866123be",
			timestamp: "2024-02-26T17:59:34.607Z",
		},
		{
			log: "Starting Build Process for id: 6a628d67-3d5c-4e42-a93a-cfa2866123be",
			timestamp: "2024-02-26T17:59:34.887Z",
		},
		{
			log: 'Running "npm install" && "npm run build"',
			timestamp: "2024-02-26T17:59:35.178Z",
		},
		{
			log: "\nadded 272 packages, and audited 273 packages in 3s\n",
			timestamp: "2024-02-26T17:59:39.324Z",
		},
		{
			log: "\n98 packages are looking for funding\n  run `npm fund` for details\n\nfound 0 vulnerabilities\n",
			timestamp: "2024-02-26T17:59:39.326Z",
		},
		{
			log: "\n> vite-project@0.0.0 build\n> vite build\n\n",
			timestamp: "2024-02-26T17:59:39.818Z",
		},
		{
			log: "vite v5.1.2 building for production...\n",
			timestamp: "2024-02-26T17:59:40.242Z",
		},
		{
			log: "transforming...\n",
			timestamp: "2024-02-26T17:59:40.320Z",
		},
		{
			log: "✓ 34 modules transformed.\n",
			timestamp: "2024-02-26T17:59:41.029Z",
		},
		{
			log: "rendering chunks...\n",
			timestamp: "2024-02-26T17:59:41.127Z",
		},
		{
			log: "computing gzip size...\n",
			timestamp: "2024-02-26T17:59:41.133Z",
		},
		{
			log: "dist/index.html                   0.47 kB │ gzip:  0.30 kB\n",
			timestamp: "2024-02-26T17:59:41.140Z",
		},
		{
			log: "dist/assets/react-CHdo91hT.svg    4.13 kB │ gzip:  2.05 kB\ndist/assets/index-DiwrgTda.css    1.39 kB │ gzip:  0.72 kB\ndist/assets/index-Cut9hnE5.js   143.81 kB │ gzip: 46.30 kB\n✓ built in 871ms\n",
			timestamp: "2024-02-26T17:59:41.142Z",
		},
		{
			log: "Finished building project for id: 6a628d67-3d5c-4e42-a93a-cfa2866123be",
			timestamp: "2024-02-26T17:59:41.359Z",
		},
	];

	return (
		<div>
			<br />
			<br />
			<br />
			<div>logs</div>
			{logs.length > 0 && (
				<div
					className={`${firaCode.className} text-sm text-green-500 logs-container mt-5 border-green-500 border-2 rounded-lg p-4 h-[300px] overflow-y-auto`}
				>
					<pre className="flex flex-col gap-1">
						{logs.map((log, i) => (
							// check if log.log has a newline character
							// if it does, split the log.log by newline character
							// else, return the log.log
							<>
								{log.log.includes("\n") ? (
									log.log
										.split("\n")
										.map((line, i) => <div key={i}>{line}</div>)
								) : (
									<div key={i}>{log.log}</div>
								)}
							</>
						))}
					</pre>
				</div>
			)}
		</div>
	);
};

export default page;
