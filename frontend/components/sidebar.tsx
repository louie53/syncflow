"use client";

import { useWorkspaces } from "@/hooks/useWorkspaces";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
// 👇 引入刚才写的弹窗组件
import { CreateWorkspaceDialog } from "./workspace/create-workspace-dialog";

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    // 👇 控制弹窗显示的状态
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const currentWorkspaceId = searchParams.get('workspaceId');

    // 👇 下面这行如果有报错，看最后的“补充步骤”
    const { workspaces, loading, refreshWorkspaces } = useWorkspaces();

    if (pathname === "/login" || pathname === "/register") {
        return null;
    }

    const handleWorkspaceClick = (id: string) => {
        router.push(`/?workspaceId=${id}`);
    };

    // ✨ 创建成功后的回调：刷新列表，并跳转到新工作区
    const handleCreateSuccess = async (newId: string) => {
        await refreshWorkspaces(); // 重新拉取列表
        router.push(`/?workspaceId=${newId}`); // 自动跳转过去
    };

    return (
        <>
            <aside className="w-64 bg-gray-100 border-r h-screen p-4 flex flex-col hidden md:flex">
                <div className="mb-6">
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Workspaces
                    </h2>

                    <div className="space-y-1">
                        {loading ? (
                            <div className="text-sm text-gray-400 animate-pulse">Loading...</div>
                        ) : (
                            workspaces.map((ws) => {
                                const isActive = currentWorkspaceId === ws._id;
                                return (
                                    <div
                                        key={ws._id}
                                        onClick={() => handleWorkspaceClick(ws._id)}
                                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-all ${isActive
                                            ? "bg-white text-blue-600 shadow-sm"
                                            : "text-gray-700 hover:bg-white/50"
                                            }`}
                                    >
                                        <span className={`w-2 h-2 rounded-full mr-2 ${isActive ? "bg-blue-600" : "bg-gray-400"
                                            }`} />
                                        {ws.name}
                                    </div>
                                );
                            })
                        )}

                        {!loading && workspaces.length === 0 && (
                            <div className="text-sm text-gray-400 px-3 py-2">No workspaces found</div>
                        )}
                    </div>
                </div>

                <div className="mt-auto border-t pt-4">
                    {/* 👇 点击按钮，打开弹窗 */}
                    <button
                        onClick={() => setIsDialogOpen(true)}
                        className="text-sm text-gray-500 hover:text-gray-900 w-full text-left flex items-center px-2 py-2 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        <span className="text-lg mr-2 leading-none">+</span> New Workspace
                    </button>
                </div>
            </aside>

            {/* 👇 渲染弹窗组件 */}
            <CreateWorkspaceDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSuccess={handleCreateSuccess}
            />
        </>
    );
}