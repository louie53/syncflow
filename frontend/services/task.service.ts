import { apiClient } from '@/lib/api-client';
import { CreateTaskDto, Task, TaskStatus } from '@/types/task';

export const taskService = {
    // 1. 获取任务列表 (支持按工作区筛选)
    getAll: async (workspaceId?: string) => {
        // 如果传了 workspaceId，就拼接到 URL 后面
        // 例如: /tasks?workspaceId=679e...
        const url = workspaceId ? `/tasks?workspaceId=${workspaceId}` : '/tasks';

        const { data } = await apiClient.get<{ tasks: Task[] }>(url);
        console.log('Fetched tasks:', data.tasks);
        return data.tasks;
    },

    // 2. 创建任务 (Payload 里现在强制要求 workspaceId)
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