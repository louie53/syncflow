"use client";

import { useWorkspaces } from "@/hooks/useWorkspaces";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CreateWorkspaceDialog } from "./workspace/create-workspace-dialog";

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const currentWorkspaceId = searchParams.get('workspaceId');

    const { workspaces, loading, refreshWorkspaces } = useWorkspaces();

    if (pathname === "/login" || pathname === "/register") {
        return null;
    }

    const handleWorkspaceClick = (id: string) => {
        router.push(`/?workspaceId=${id}`);
    };

    const handleCreateSuccess = async (newId: string) => {
        await refreshWorkspaces();
        router.push(`/?workspaceId=${newId}`);
    };

    // ✨ 核心修复逻辑：获取实际应该高亮的 ID
    const activeId = currentWorkspaceId || (workspaces?.length > 0 ? workspaces[0]._id : null);

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
                                // ✨ 使用我们算出来的 activeId 进行判断
                                const isActive = activeId === ws._id;
                                return (
                                    <div
                                        key={ws._id}
                                        onClick={() => handleWorkspaceClick(ws._id)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                handleWorkspaceClick(ws._id);
                                            }
                                        }}
                                        role="button"
                                        tabIndex={0}
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
                    <button
                        onClick={() => setIsDialogOpen(true)}
                        className="text-sm text-gray-500 hover:text-gray-900 w-full text-left flex items-center px-2 py-2 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        <span className="text-lg mr-2 leading-none">+</span> New Workspace
                    </button>
                </div>
            </aside>

            <CreateWorkspaceDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSuccess={handleCreateSuccess}
            />
        </>
    );
}