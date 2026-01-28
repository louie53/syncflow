import { CreateTaskDto, Task, TaskStatus } from '@/types/task';
// 👇 Import the shared instance
import { apiClient } from '@/lib/api-client';

export const taskService = {
    getAll: async () => {
        // Full URL: http://localhost:4000/api/tasks
        const { data } = await apiClient.get<{ tasks: Task[] }>('/tasks');
        console.log('data', data)
        return data.tasks;
    },

    create: async (payload: CreateTaskDto) => {
        const { data } = await apiClient.post<{ task: Task }>('/tasks', payload);
        return data.task;
    },

    updateStatus: async (id: string, status: TaskStatus) => {
        const { data } = await apiClient.put<{ task: Task }>(`/tasks/${id}`, { status });
        return data.task;
    },

    delete: async (id: string) => {
        await apiClient.delete(`/tasks/${id}`);
    }
};