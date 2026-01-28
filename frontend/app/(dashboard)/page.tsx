"use client";

import { TaskCard } from "@/components/tasks/task-card";
// 👇 记得确保这个组件文件存在
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { useAuth } from "@/context/auth-context";
import { useTasks } from "@/hooks/use-tasks";

export default function DashboardPage() {
  const { tasks, isLoading, updateStatus, deleteTask, refreshTasks } = useTasks();
  const { user } = useAuth();

  // 计算未完成的任务数量
  const pendingCount = tasks.filter(t => t.status !== 'DONE').length;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header 区域 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Good Morning, {user?.firstName || 'User'}! ☀️
          </h1>
          <p className="text-gray-500 mt-1">
            You have <span className="font-semibold text-blue-600">{pendingCount}</span> tasks remaining.
          </p>
        </div>

        {/* 新建任务按钮 (弹窗) */}
        <CreateTaskDialog onSuccess={refreshTasks} />
      </div>

      {/* 任务列表区域 */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-10 text-gray-400">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center bg-gray-50/50">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              📝
            </div>
            <h3 className="text-lg font-medium text-gray-900">No tasks yet</h3>
            <p className="text-gray-500 mt-1 mb-4 max-w-sm mx-auto">
              Your workspace is looking clean. Create your first task to get started!
            </p>
            <div className="inline-block">
              <CreateTaskDialog onSuccess={refreshTasks} />
            </div>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onStatusChange={updateStatus}
              onDelete={deleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
}