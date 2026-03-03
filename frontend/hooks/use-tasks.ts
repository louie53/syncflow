'use client';

import { useAuth } from '@/context/auth-context';
import { useWorkspaces } from '@/hooks/useWorkspaces';
import { taskService } from '@/services/task.service';
import { Task, TaskPriority, TaskStatus } from '@/types/task';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react'; // ✨ 引入 useMemo
import { toast } from "sonner";

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const { user } = useAuth();
    const { workspaces, loading: workspaceLoading } = useWorkspaces();

    const searchParams = useSearchParams();
    const urlWorkspaceId = searchParams.get('workspaceId');

    // ✨✨✨ 关键修改：精准计算 ID，防止对象溜进去 ✨✨✨
    const activeWorkspaceId = useMemo(() => {
        // 1. 优先使用 URL 中的 ID
        if (urlWorkspaceId && typeof urlWorkspaceId === 'string' && urlWorkspaceId !== 'undefined') {
            return urlWorkspaceId;
        }
        // 2. 其次使用第一个工作区的 ID
        if (!workspaceLoading && workspaces && workspaces.length > 0) {
            const firstWs = workspaces[0];
            // 确保取的是属性而非整个对象
            return typeof firstWs === 'object' ? firstWs._id : firstWs;
        }
        return null;
    }, [urlWorkspaceId, workspaces, workspaceLoading]);

    const fetchTasks = useCallback(async () => {
        // ✨ 防御逻辑：只有当 ID 是合法的 24 位字符串时才发请求
        if (!user || workspaceLoading || !activeWorkspaceId) return;

        // MongoDB ObjectId 校验正则
        if (!/^[0-9a-fA-F]{24}$/.test(activeWorkspaceId)) {
            console.warn("⚠️ 拦截到不合法的 ID 请求:", activeWorkspaceId);
            return;
        }

        try {
            setIsLoading(true);
            const data = await taskService.getAll(activeWorkspaceId);
            setTasks(data);
        } catch (error) {
            console.error('Failed to fetch tasks', error);
        } finally {
            setIsLoading(false);
        }
    }, [user, activeWorkspaceId, workspaceLoading]);

    // --- 以下是原本的所有逻辑，全部保留 ---

    const createTask = async (payload: { title: string; description?: string; priority?: TaskPriority }) => {
        try {
            if (!activeWorkspaceId) {
                toast.error("Please select or create a workspace first!");
                return false;
            }

            const newTask = await taskService.create({
                ...payload,
                workspaceId: activeWorkspaceId
            });

            setTasks((prev) => [newTask, ...prev]);
            toast.success("Task created successfully");
            return true;
        } catch (error) {
            console.error('Failed to create task', error);
            toast.error("Failed to create task");
            return false;
        }
    };

    const updateStatus = async (id: string, newStatus: TaskStatus) => {
        setTasks((prev) => prev.map(t => t._id === id ? { ...t, status: newStatus } : t));
        try {
            await taskService.updateStatus(id, newStatus);
        } catch (error) {
            console.error('Update failed', error);
            toast.error("Failed to update task");
            fetchTasks();
        }
    };

    const deleteTask = async (id: string) => {
        setTasks((prev) => prev.filter(t => t._id !== id));
        try {
            await taskService.delete(id);
            toast.success("Task deleted successfully");
        } catch (error) {
            console.error('Delete failed', error);
            toast.error("Failed to delete task");
            fetchTasks();
        }
    };

    const updateTask = async (id: string, payload: { title?: string; description?: string; priority?: TaskPriority }) => {
        setTasks((prev) => prev.map(t =>
            t._id === id ? { ...t, ...payload } : t
        ));

        try {
            await taskService.update(id, payload);
            toast.success("Task updated successfully");
        } catch (error) {
            console.error('Update failed', error);
            toast.error("Failed to update task");
            fetchTasks();
        }
    };
    // ✨ 新增：专门给 Socket 用的本地更新方法，不发 API
    const updateTaskLocally = useCallback((id: string, newStatus: TaskStatus) => {
        setTasks((prev) => prev.map(t => t._id === id ? { ...t, status: newStatus } : t));
    }, []);
    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    return {
        tasks,
        isLoading,
        createTask,
        updateStatus,
        deleteTask,
        refreshTasks: fetchTasks,
        activeWorkspaceId,
        updateTask,
        updateTaskLocally // ✨ 暴露给外部组件使用
    };
}