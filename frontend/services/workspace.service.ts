// src/services/workspace.service.ts
import { apiClient } from '@/lib/api-client';
// 1. 定义成员的具体结构 (不再用 any)
export interface WorkspaceMember {
    userId: string;
    role: 'OWNER' | 'ADMIN' | 'MEMBER';
    joinedAt: string;
}
export interface Workspace {
    _id: string;
    name: string;
    ownerId: string;
    members: WorkspaceMember[];
    createdAt: string;
}

export const workspaceService = {
    // 1. 获取我的工作区列表
    // 实际请求地址: GET http://localhost:4000/api/workspaces
    getAll: async () => {
        const response = await apiClient.get<{ workspaces: Workspace[] }>('/workspaces');
        return response.data.workspaces;
    },

    // 2. 创建新工作区
    // 实际请求地址: POST http://localhost:4000/api/workspaces
    create: async (name: string) => {
        const response = await apiClient.post<{ workspace: Workspace }>('/workspaces', {
            name
        });
        return response.data.workspace;
    }
};