import { useAuth } from '@/context/auth-context';
import { taskService } from '@/services/task.service';
import { Task, TaskStatus } from '@/types/task';
import { useCallback, useEffect, useState } from 'react';

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();

    const fetchTasks = useCallback(async () => {
        if (!user) return;
        try {
            setIsLoading(true);
            const data = await taskService.getAll(); // 👈 调用 Service，极其优雅
            setTasks(data);
        } catch (error) {
            console.error('Failed to fetch tasks', error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    const createTask = async (title: string) => {
        try {
            const newTask = await taskService.create({ title });
            setTasks((prev) => [newTask, ...prev]);
            return true;
        } catch (error) {
            console.error('Failed to create task', error);
            return false;
        }
    };

    const updateStatus = async (id: string, newStatus: TaskStatus) => {
        // 乐观更新 (先变 UI)
        setTasks((prev) => prev.map(t => t._id === id ? { ...t, status: newStatus } : t));
        try {
            await taskService.updateStatus(id, newStatus);
        } catch (error) {
            console.error('Update failed', error);
            fetchTasks(); // 失败回滚
        }
    };

    const deleteTask = async (id: string) => {
        // 乐观更新
        setTasks((prev) => prev.filter(t => t._id !== id));
        try {
            await taskService.delete(id);
        } catch (error) {
            console.error('Delete failed', error);
            fetchTasks();
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    return { tasks, isLoading, createTask, updateStatus, deleteTask };
}