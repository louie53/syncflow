import { workspaceService } from "@/services/workspace.service";
import { Workspace } from "@/types";
import { useState } from "react";
import { toast } from "sonner";

export function useCreateWorkspace(onSuccess: (ws: Workspace) => void) {
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleCreate = async () => {
        const trimmedName = name.trim();
        if (!trimmedName) return;

        try {
            setIsLoading(true);
            const newWorkspace = await workspaceService.create(trimmedName);

            setName(""); // 重置输入
            toast.success(`Workspace "${newWorkspace.name}" ready!`);
            onSuccess(newWorkspace);
            return true; // 代表成功
        } catch (error) {
            console.error("Create Workspace Error:", error);
            toast.error("Failed to create workspace. Try another name?");
            return false; // 代表失败
        } finally {
            setIsLoading(false);
        }
    };

    return {
        name,
        setName,
        isLoading,
        handleCreate
    };
}