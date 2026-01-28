"use client"; // 必须加这个，因为用了 Hook

import { useWorkspaces } from "@/hooks/useWorkspaces";
import { usePathname } from "next/navigation"; // 1. 引入这个
export function Sidebar() {
    const pathname = usePathname(); // 2. 获取当前路径

    const { workspaces, loading } = useWorkspaces();
    // 3. 如果是登录或注册页，直接返回 null (不渲染)
    if (pathname === "/login" || pathname === "/register") {
        return null;
    }
    return (
        <aside className="w-64 bg-gray-100 border-r h-screen p-4 flex flex-col hidden md:flex">
            {/* 标题 */}
            <div className="mb-6">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Workspaces
                </h2>

                {/* 列表区域 */}
                <div className="space-y-1">
                    {loading ? (
                        <div className="text-sm text-gray-400 animate-pulse">Loading...</div>
                    ) : (
                        workspaces.map((ws) => (
                            <div
                                key={ws._id}
                                className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-white hover:shadow-sm cursor-pointer transition-all"
                            >
                                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                                {ws.name}
                            </div>
                        ))
                    )}

                    {/* 如果没有数据 */}
                    {!loading && workspaces.length === 0 && (
                        <div className="text-sm text-gray-400 px-3 py-2">No workspaces found</div>
                    )}
                </div>
            </div>

            <div className="mt-auto border-t pt-4">
                <button className="text-sm text-gray-500 hover:text-gray-900">
                    + New Workspace
                </button>
            </div>
        </aside>
    );
}