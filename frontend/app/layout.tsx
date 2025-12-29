import { AuthProvider } from "@/context/auth-context";
import { cn } from "@/lib/utils"; // Shadcn 的工具函数，用于合并类名
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // ✅ 关键：样式入口

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SyncFlow",
  description: "Project Management App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* ✨ 优化点：
         1. antialiased: 让字体更清晰
         2. min-h-screen bg-background: 确保背景色铺满全屏，且使用 globals.css 定义的变量
         3. cn(...): 安全地合并 Next.js 字体类和 Tailwind 类
      */}
      <body className={cn(inter.className, "antialiased min-h-screen bg-background")}>
        <AuthProvider>
          {/* ❌ 我移除了 <Navbar /> 
             原因：登录页不需要 Navbar，而 Dashboard (page.tsx) 已经有自己专属的 Navbar 了
          */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}