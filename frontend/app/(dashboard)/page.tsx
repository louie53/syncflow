"use client";

import { TaskCard } from "@/components/tasks/task-card";
// ✅ 保留你封装好的弹窗组件
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { useAuth } from "@/context/auth-context";
import { useTasks } from "@/hooks/use-tasks";
import { TaskStatus } from "@/types/task"; // 引入类型以便遍历状态

export default function DashboardPage() {
  const { tasks, isLoading, updateStatus, deleteTask, refreshTasks, updateTask } = useTasks();
  const { user } = useAuth();

  // ✅ 保留：计算未完成的任务数量
  const pendingCount = tasks.filter(t => t.status !== 'DONE').length;

  // ✨ 新增：将任务按状态分组 (为了三列布局)
  const columns = {
    TODO: tasks.filter(t => t.status === 'TODO'),
    IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS'),
    DONE: tasks.filter(t => t.status === 'DONE'),
  };

  return (
    // 修改：看板通常需要宽屏，所以把 max-w-5xl 去掉或者改大，让它横向铺开
    <div className="p-8 h-screen flex flex-col">
      {/* Header 区域 (保留) */}
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Good Morning, {user?.firstName || 'User'}! ☀️
          </h1>
          <p className="text-gray-500 mt-1">
            You have <span className="font-semibold text-blue-600">{pendingCount}</span> tasks remaining.
          </p>
        </div>

        {/* 新建任务按钮 (保留你的组件) */}
        <CreateTaskDialog onSuccess={refreshTasks} />
      </div>

      {/* ✨ 任务看板区域 (核心改动) */}
      {/* 从原来的 space-y-4 改为 grid 三列布局 */}
      <div className="flex-1 overflow-x-auto">
        {isLoading ? (
          <div className="text-center py-10 text-gray-400">Loading tasks...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-w-[800px]">

            {/* 遍历三种状态生成列 */}
            {(['TODO', 'IN_PROGRESS', 'DONE'] as TaskStatus[]).map((status) => (
              <div key={status} className="flex flex-col h-full bg-gray-50/50 rounded-xl border border-gray-200">

                {/* 列标题 */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-xl">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${status === 'TODO' ? 'bg-gray-400' :
                        status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-green-500'
                      }`} />
                    <h3 className="font-semibold text-gray-700 text-sm">
                      {status.replace('_', ' ')}
                    </h3>
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                      {columns[status].length}
                    </span>
                  </div>
                </div>

                {/* 列内容 (任务列表) */}
                <div className="flex-1 p-3 overflow-y-auto space-y-3">
                  {columns[status].map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onStatusChange={updateStatus}
                      onDelete={deleteTask}
                      onUpdate={updateTask}
                    />
                  ))}

                  {/* 该列没有任务时的空状态 */}
                  {columns[status].length === 0 && (
                    <div className="h-24 border-2 border-dashed border-gray-100 rounded-lg flex items-center justify-center text-gray-300 text-sm">
                      No {status.toLowerCase().replace('_', ' ')} tasks
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}