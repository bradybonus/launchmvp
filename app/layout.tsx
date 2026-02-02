import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LaunchProvider } from "@/lib/context/LaunchContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Launch | AI-Powered Product Launch Management",
  description: "Turn shipped product features into successful customer launches.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <LaunchProvider>{children}</LaunchProvider>
      </body>
    </html>
  );
}
