"use client";

import { Sidebar } from "@/components/sidebar";
import { usePathname } from "next/navigation";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // 定义哪些页面不需要侧边栏
    const isAuthPage = pathname === "/login" || pathname === "/register";

    if (isAuthPage) {
        // 如果是登录页，直接全屏显示内容，不加 Flex 布局，不渲染 Sidebar
        return <main className="h-screen w-full bg-white">{children}</main>;
    }

    // 如果是正常页面，显示侧边栏布局
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-gray-50/50">
                {children}
            </main>
        </div>
    );
}