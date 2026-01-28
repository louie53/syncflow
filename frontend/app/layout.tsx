import { AuthProvider } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SyncFlow",
  description: "Project Management App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased min-h-screen bg-background")}>
        <AuthProvider>
          {/* 👇 这里不再需要 Sidebar 或 Wrapper 了，直接放 children */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}