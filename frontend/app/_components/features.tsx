import Image from "next/image";

import { Bell } from "lucide-react";

export const Features = () => {
	return (
		<section className="relative bg-[#FAFBFB] dark:bg-[#000101]">
			<div className="relative max-w-6xl mx-auto px-4 sm:px-6">
				<div className="py-12 md:py-20">
					<div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
						<h2 className="h2 mb-4 text-5xl font-bold">Explore the Steps</h2>
						<p className="text-xl text-gray-600 dark:text-gray-300">
							A lot happens behind the scenes when you deploy your website. Here
							is a breakdown of the steps involved.
						</p>
					</div>

					<div className="max-w-sm mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start md:max-w-2xl lg:max-w-none">
						{/* 1st item */}
						<div className="relative flex flex-col items-center p-6 bg-[#FEFFFE] dark:bg-[#0B0B0A] rounded shadow-xl gap-4 h-[287px]">
							<div className="block dark:hidden">
								<Image src="/github.svg" alt="github" width={50} height={50} />
							</div>
							<div className="hidden dark:block">
								<Image
									src="/github-white.svg"
									alt="github"
									width={50}
									height={50}
								/>
							</div>
							<h4 className="text-xl font-bold leading-snug tracking-tight mb-1 text-center">
								Clone Github Repository
							</h4>
							<p className="text-gray-600 dark:text-gray-300 text-center">
								{`The 'upload-service' initiates the GitHub clone process, retrieving the source code using the GitHub URL and access token`}
							</p>
						</div>

						{/* 2nd item */}
						<div className="relative flex flex-col items-center p-6 bg-[#FEFFFE] dark:bg-[#0B0B0A] rounded shadow-xl gap-4 h-[287px]">
							<Image src="/aws-s3.svg" alt="AWS S3" width="50" height="50" />
							<h4 className="text-xl font-bold leading-snug tracking-tight mb-1 text-center">
								Source Upload and Build Task Trigger
							</h4>
							<p className="text-gray-600 dark:text-gray-300 text-center">
								{`"upload-service" uploads the cloned source code to AWS S3, and triggers a Kafka topic with the build task`}
							</p>
						</div>

						{/* 3rd item */}
						<div className="relative flex flex-col items-center p-6 bg-[#FEFFFE] dark:bg-[#0B0B0A] rounded shadow-xl gap-4 h-[287px]">
							<svg
								className="w-16 h-16 p-1 -mt-1 mb-2"
								viewBox="0 0 64 64"
								xmlns="http://www.w3.org/2000/svg"
							>
								<g fill="none" fillRule="evenodd">
									<rect
										className="fill-current text-blue-600"
										width="64"
										height="64"
										rx="32"
									/>
									<g strokeWidth="2">
										<path
											className="stroke-current text-blue-300"
											d="M34.514 35.429l2.057 2.285h8M20.571 26.286h5.715l2.057 2.285"
										/>
										<path
											className="stroke-current text-white"
											d="M20.571 37.714h5.715L36.57 26.286h8"
										/>
										<path
											className="stroke-current text-blue-300"
											strokeLinecap="square"
											d="M41.143 34.286l3.428 3.428-3.428 3.429"
										/>
										<path
											className="stroke-current text-white"
											strokeLinecap="square"
											d="M41.143 29.714l3.428-3.428-3.428-3.429"
										/>
									</g>
								</g>
							</svg>
							<h4 className="text-xl font-bold leading-snug tracking-tight mb-1 text-center">
								Build Task Consumption and Deployment
							</h4>
							<p className="text-gray-600 dark:text-gray-300 text-center">
								{`'deploy-service' consumes the build task from the Kafka topic, executes build commands, and deploys the final build version to AWS S3`}
							</p>
						</div>

						{/* 4th item */}
						<div className="relative flex flex-col items-center p-6 bg-[#FEFFFE] dark:bg-[#0B0B0A] rounded shadow-xl gap-4 h-[287px]">
							<div className="block dark:hidden">
								<Image src="/kafka.svg" alt="kafka" width={80} height={80} />
							</div>
							<div className="hidden dark:block">
								<Image
									src="/kafka-white.svg"
									alt="kafka"
									width={80}
									height={80}
								/>
							</div>

							<h4 className="text-xl font-bold leading-snug tracking-tight mb-1 text-center">
								Streaming Build Logs to Client
							</h4>
							<p className="text-gray-600 dark:text-gray-300 text-center">
								{`Logs generated during the deployment process are sent from 'deploy-service' to 'upload-service' via a dedicated Kafka topic`}
							</p>
						</div>

						{/* 5th item */}
						<div className="relative flex flex-col items-center p-6 bg-[#FEFFFE] dark:bg-[#0B0B0A] rounded shadow-xl gap-4 h-[287px]">
							<Bell size={50} />
							<h4 className="text-xl font-bold leading-snug tracking-tight mb-1 text-center">
								Notify Client of Deployment status
							</h4>
							<p className="text-gray-600 dark:text-gray-300 text-center">
								{`Users receive notifications indicating the status of their build, whether it was successful or encountered any failures`}
							</p>
						</div>

						{/* 6th item */}
						<div className="relative flex flex-col items-center p-6 bg-[#FEFFFE] dark:bg-[#0B0B0A] rounded shadow-xl gap-4 h-[287px]">
							<Image
								src="/cloudfront.svg"
								alt="cloudfront"
								width="50"
								height="50"
							/>

							<h4 className="text-xl font-bold leading-snug tracking-tight mb-1 text-center">
								Proxy Server and CDN Integration
							</h4>
							<p className="text-gray-600 dark:text-gray-300 text-center">
								{`User requests are routed through a proxy server to AWS CloudFront to ensure low-latency content delivery for an exceptional user experience`}
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
