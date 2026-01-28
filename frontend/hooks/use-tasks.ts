import { useAuth } from '@/context/auth-context';
import { useWorkspaces } from '@/hooks/useWorkspaces'; // 👈 1. 引入工作区 Hook
import { taskService } from '@/services/task.service';
import { Task, TaskStatus } from '@/types/task';
import { useCallback, useEffect, useState } from 'react';

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const { user } = useAuth();
    // 👇 2. 获取工作区列表
    const { workspaces, loading: workspaceLoading } = useWorkspaces();

    const fetchTasks = useCallback(async () => {
        if (!user) return;

        try {
            setIsLoading(true);
            // 👇 3. 尝试只获取当前工作区的任务 (如果有工作区的话)
            // 如果列表为空，暂时传 undefined，后端会返回空列表或报错
            const currentWorkspaceId = workspaces[0]?._id;

            const data = await taskService.getAll(currentWorkspaceId);
            setTasks(data);
        } catch (error) {
            console.error('Failed to fetch tasks', error);
        } finally {
            setIsLoading(false);
        }
    }, [user, workspaces]); // 依赖项加上 workspaces

    const createTask = async (payload: { title: string; description?: string; priority?: string }) => {
        try {
            // 👇 4. 核心逻辑：如果没有工作区，拦截操作
            const currentWorkspaceId = workspaces[0]?._id;

            if (!currentWorkspaceId) {
                alert("请先在侧边栏创建一个工作区！");
                return false;
            }

            // 👇 5. 传 workspaceId 给 Service
            const newTask = await taskService.create({
                ...payload, // 展开 title, description, priority
                workspaceId: currentWorkspaceId
            });

            setTasks((prev) => [newTask, ...prev]);
            return true;
        } catch (error) {
            console.error('Failed to create task', error);
            return false;
        }
    };

    const updateStatus = async (id: string, newStatus: TaskStatus) => {
        setTasks((prev) => prev.map(t => t._id === id ? { ...t, status: newStatus } : t));
        try {
            await taskService.updateStatus(id, newStatus);
        } catch (error) {
            console.error('Update failed', error);
            fetchTasks();
        }
    };

    const deleteTask = async (id: string) => {
        setTasks((prev) => prev.filter(t => t._id !== id));
        try {
            await taskService.delete(id);
        } catch (error) {
            console.error('Delete failed', error);
            fetchTasks();
        }
    };

    // 只有当工作区加载完了再去取任务，避免空跑
    useEffect(() => {
        if (!workspaceLoading) {
            fetchTasks();
        }
    }, [fetchTasks, workspaceLoading]);

    return {
        tasks,
        isLoading,
        createTask,
        updateStatus,
        deleteTask,
        refreshTasks: fetchTasks // ✅ 新增这一行
    };
}