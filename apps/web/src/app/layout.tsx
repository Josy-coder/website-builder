import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { TRPCProvider } from "@/lib/trpc/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Website Builder Platform",
    description: "A Figma-like website builder that outputs production-ready Next.js websites",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <TRPCProvider>{children}</TRPCProvider>
        </body>
        </html>
    );
}