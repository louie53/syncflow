export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
    _id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    workspaceId: string; // ✅ 新增：任务属于哪个工作区
    priority?: TaskPriority; // ✨ 加上这个！(?表示老数据可能没有)
    createdBy: string;   // ✅ 更新：后端现在返回的是 createdBy 而不是 userId
    createdAt: string;
    updatedAt: string;
}
// 👇 关键：必须有 export，外面才能 import
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface CreateTaskDto {
    title: string;
    description?: string;
    workspaceId: string; // 🚨 关键：这是必须要加的“通行证”
}