import { useAuth } from '@/context/auth-context';
import { useWorkspaces } from '@/hooks/useWorkspaces';
import { taskService } from '@/services/task.service';
import { Task, TaskStatus } from '@/types/task';
import { useSearchParams } from 'next/navigation'; // 👈 1. 引入这个
import { useCallback, useEffect, useState } from 'react';

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const { user } = useAuth();
    const { workspaces, loading: workspaceLoading } = useWorkspaces();

    // 👇 2. 获取 URL 上的 workspaceId 参数
    const searchParams = useSearchParams();
    const urlWorkspaceId = searchParams.get('workspaceId');

    // 👇 3. 核心逻辑：优先用 URL 里的 ID，如果没有（比如刚进首页），就默认用第一个
    const activeWorkspaceId = urlWorkspaceId || workspaces[0]?._id;

    const fetchTasks = useCallback(async () => {
        // 如果没有用户，或者工作区还没加载完，先不发请求
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

    const createTask = async (payload: { title: string; description?: string; priority?: string }) => {
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

    // 当 activeWorkspaceId 变化时（比如点击了侧边栏），自动重新获取数据
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
        activeWorkspaceId // 把这个也导出去，以后页面上可能会用到
    };
}