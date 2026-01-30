import { useAuth } from '@/context/auth-context';
import { useWorkspaces } from '@/hooks/useWorkspaces';
import { taskService } from '@/services/task.service';
// 👇 1. 引入 TaskPriority
import { Task, TaskPriority, TaskStatus } from '@/types/task';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const { user } = useAuth();
    const { workspaces, loading: workspaceLoading } = useWorkspaces();

    const searchParams = useSearchParams();
    const urlWorkspaceId = searchParams.get('workspaceId');

    const activeWorkspaceId = urlWorkspaceId || workspaces[0]?._id;

    const fetchTasks = useCallback(async () => {
        if (!user || workspaceLoading) return;

        try {
            setIsLoading(true);

            // 使用我们计算出来的 activeWorkspaceId
            const data = await taskService.getAll(activeWorkspaceId);
            setTasks(data);
        } catch (error) {
            console.error('Failed to fetch tasks', error);
        } finally {
            setIsLoading(false);
        }
    }, [user, activeWorkspaceId, workspaceLoading]); // 依赖项加上 activeWorkspaceId

    // 👇 2. 修改 payload 类型：priority?: string -> priority?: TaskPriority
    const createTask = async (payload: { title: string; description?: string; priority?: TaskPriority }) => {
        try {
            if (!activeWorkspaceId) {
                alert("请先创建一个工作区！");
                return false;
            }

            // 使用当前选中的工作区 ID
            const newTask = await taskService.create({
                ...payload,
                workspaceId: activeWorkspaceId
            });

            setTasks((prev) => [newTask, ...prev]);
            return true;
        } catch (error) {
            console.error('Failed to create task', error);
            return false;
        }
    };

    const updateStatus = async (id: string, newStatus: TaskStatus) => {
        // 乐观更新 UI
        setTasks((prev) => prev.map(t => t._id === id ? { ...t, status: newStatus } : t));
        try {
            await taskService.updateStatus(id, newStatus);
        } catch (error) {
            console.error('Update failed', error);
            fetchTasks(); // 失败回滚
        }
    };

    const deleteTask = async (id: string) => {
        // 乐观更新 UI
        setTasks((prev) => prev.filter(t => t._id !== id));
        try {
            await taskService.delete(id);
        } catch (error) {
            console.error('Delete failed', error);
            fetchTasks(); // 失败回滚
        }
    };

    // 👇 3. 修改 payload 类型：priority?: string -> priority?: TaskPriority
    const updateTask = async (id: string, payload: { title?: string; description?: string; priority?: TaskPriority }) => {
        // 乐观更新：现在这里的类型匹配了，TS 不会报错了
        setTasks((prev) => prev.map(t =>
            t._id === id ? { ...t, ...payload } : t
        ));

        try {
            await taskService.update(id, payload);
        } catch (error) {
            console.error('Update failed', error);
            fetchTasks();
        }
    };

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
        updateTask // 导出这个方法
    };
}