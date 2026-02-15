"use client";

// ✨ 1. 保持动态渲染
export const dynamic = 'force-dynamic';

import { Sidebar } from "@/components/sidebar";
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user, isLoading } = useAuth();

    // ✨✨✨ 路由保护 (搬到 Layout 里来) ✨✨✨
    useEffect(() => {
        // 如果加载完了且没用户，直接跳登录页
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    // ✨✨✨ 渲染拦截 ✨✨✨
    // 如果正在加载，或者没有用户，显示全屏 Loading
    // 这样连侧边栏 (Sidebar) 都不会渲染出来！
    if (isLoading || !user) {
        return <DashboardSkeleton />;
    }

    // ✨ 只有登录了，才会渲染下面的 Sidebar 和 children (DashboardPage)
    return (
        <div className="flex h-screen w-full">
            {/* 这里应该是你原来的 Sidebar 组件，虽然你在 layout 代码里可能引用了它 */}
            {/* 如果你的 layout.tsx 原本有 Sidebar，它会在这里正常渲染 */}
            <Sidebar />
            {/* ⚠️ 注意：请确保这里保留了你原来 layout.tsx 里的结构！ */}
            {/* 下面是一个通用的 Dashboard 布局结构，请根据你实际的 layout.tsx 调整 */}

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}