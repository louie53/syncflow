import { AuthProvider } from "@/context/auth-context";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// 👇 1. 引入 Toaster
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SyncFlow",
  description: "Project Management for High Performers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          {/* 👇 2. 放在这里，通常放在最下面。richColors 让成功/失败有颜色 */}
          <Toaster position="top-right" richColors closeButton />
        </AuthProvider>
      </body>
    </html>
  );
}