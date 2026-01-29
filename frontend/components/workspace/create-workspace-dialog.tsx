"use client";

import { useState } from "react";
// 👇 引入你刚才展示的 service
import { workspaceService } from "@/services/workspace.service";

interface CreateWorkspaceDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (newWorkspaceId: string) => void; // 成功后回调
}

export function CreateWorkspaceDialog({ isOpen, onClose, onSuccess }: CreateWorkspaceDialogProps) {
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        try {
            setIsLoading(true);
            // 调用你的 service
            const newWorkspace = await workspaceService.create(name);
            setName(""); // 清空输入框
            onSuccess(newWorkspace._id); // 通知父组件成功了
            onClose(); // 关闭弹窗
        } catch (error) {
            console.error("Failed to create workspace", error);
            alert("Failed to create workspace");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Workspace</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Workspace Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Work, Personal, Side Project"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !name.trim()}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? "Creating..." : "Create Workspace"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}