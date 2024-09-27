import type {Metadata} from "next";
import localFont from "next/font/local";
import "./globals.css";
import {ReactNode} from "react";

export const metadata: Metadata = {
    title: "Unknown",
    description: "unknown",
};

export default function RootLayout({children}: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
}
