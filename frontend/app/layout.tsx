import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { Navbar } from "@/components/custom/navbar";

import { getServerSession } from "next-auth";
import SessionProvider from "@/components/providers/session-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Vercel Clone",
	description:
		"Vercel Clone is the Frontend Cloud. Upload, deploy, and manage your own frontend.",
	// TODO: add vercel dark & light theme logo
	// icons: {
	// 	icon: [
	// 		{
	// 			media: "(prefers-color-scheme: light)",
	// 			url: "/logo.svg",
	// 			href: "/logo.svg",
	// 		},
	// 		{
	// 			media: "(prefers-color-scheme: dark)",
	// 			url: "/logo-dark.svg",
	// 			href: "/logo-dark.svg",
	// 		},
	// 	],
	// },
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await getServerSession();

	return (
		<html lang="en">
			<body className={inter.className}>
				<SessionProvider session={session}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
						storageKey="vercel-clone-theme"
					>
						<Navbar />
						<Toaster />
						<div className="mt-auto">{children}</div>
					</ThemeProvider>
				</SessionProvider>
			</body>
		</html>
	);
}
