"use client";

import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

export const Hero = () => {
	const { data: session } = useSession();

	return (
		<section className="relative h-screen overflow-x-hidden">
			<div
				className="absolute left-1/2 transform -translate-x-1/2 bottom-0 pointer-events-none -z-1"
				aria-hidden="true"
			>
				<svg
					width="1360"
					height="578"
					viewBox="0 0 1360 578"
					xmlns="http://www.w3.org/2000/svg"
				>
					<defs>
						<linearGradient
							x1="50%"
							y1="0%"
							x2="50%"
							y2="100%"
							id="illustration-01"
						>
							<stop stopColor="#FFF" offset="0%" />
							<stop stopColor="#EAEAEA" offset="77.402%" />
							<stop stopColor="#DFDFDF" offset="100%" />
						</linearGradient>
					</defs>
					<g fill="url(#illustration-01)" fillRule="evenodd">
						<circle cx="1232" cy="128" r="128" />
						<circle cx="155" cy="443" r="64" />
					</g>
				</svg>
			</div>

			<div className="mt-[-90px] max-w-6xl mx-auto px-4 sm:px-6 h-full flex items-center justify-center">
				{/* Hero content */}
				<div className="pt-32 pb-12 md:pt-40 md:pb-20">
					{/* Section header */}
					<div className="text-center pb-12 md:pb-16">
						<h1
							className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4"
							data-aos="zoom-y-out"
						>
							Deploy your website in{" "}
							<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
								seconds
							</span>
						</h1>
						<div className="max-w-3xl mx-auto mt-10">
							<p
								className="text-xl text-gray-600 dark:text-gray-300 mb-8"
								data-aos="zoom-y-out"
								data-aos-delay="150"
							>
								Sign in with Github to import your repositories and deploy
								directly from Vercel Clone.
							</p>
							<div
								className="max-w-xs mx-auto sm:max-w-none flex items-center justify-center gap-3"
								data-aos="zoom-y-out"
								data-aos-delay="300"
							>
								{session?.user ? (
									<>
										<Link href="/dashboard">
											<Button>Go to Dashboard</Button>
										</Link>
									</>
								) : (
									<>
										<Button onClick={() => signIn("github")}>Log In</Button>

										<Button onClick={() => signIn("github")} variant="outline">
											Sign Up
										</Button>
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
