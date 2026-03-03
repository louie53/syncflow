"use client";

import { useCreateWorkspace } from "@/hooks/use-create-workspace";
import { Workspace } from "@/types";
import { Loader2, X } from "lucide-react";

interface CreateWorkspaceDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (workspace: Workspace) => void;
}

export function CreateWorkspaceDialog({ isOpen, onClose, onSuccess }: CreateWorkspaceDialogProps) {
    // ✨ 使用自定义 Hook
    const { name, setName, isLoading, handleCreate } = useCreateWorkspace(onSuccess);

    if (!isOpen) return null;

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await handleCreate();
        if (success) onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                <div className="flex justify-between mb-6">
                    <h2 className="text-xl font-bold">Create Workspace</h2>
                    <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name your workspace..."
                        disabled={isLoading}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        autoFocus
                    />

                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="text-gray-500">Cancel</button>
                        <button
                            type="submit"
                            disabled={isLoading || !name.trim()}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}