import { Workspace, workspaceService } from '@/services/workspace.service';
import { useEffect, useState } from 'react';

export function useWorkspaces() {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWorkspaces = async () => {
        try {
            setLoading(true);
            const data = await workspaceService.getAll();
            setWorkspaces(data);
        } catch (err: unknown) { // ✅ 改动 1: 把 any 改为 unknown
            console.error("Failed to fetch workspaces", err);

            // ✅ 改动 2: 进行类型检查
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkspaces();
    }, []);

    return { workspaces, loading, error, refreshWorkspaces: fetchWorkspaces };
}