"use client";

import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { DraggableTask } from "@/components/tasks/draggable-task";
import { DroppableColumn } from "@/components/tasks/droppable-column";
import { TaskCard } from "@/components/tasks/task-card";
import { Button } from "@/components/ui/button"; // 确保引入 Button
import { useAuth } from "@/context/auth-context";
import { useTasks } from "@/hooks/use-tasks";
import { Task, TaskStatus } from "@/types/task";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { LogOut } from "lucide-react"; // ✨ 引入 LogOut 图标
import { useState } from "react";
import { toast } from "sonner";
export const dynamic = 'force-dynamic';
export default function DashboardPage() {
  const { tasks, isLoading, updateStatus, deleteTask, refreshTasks, updateTask } = useTasks();
  // ✨ 解构出 logout 方法
  const { user, logout } = useAuth();

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  const pendingCount = tasks.filter(t => t.status !== 'DONE').length;

  const columns: Record<string, typeof tasks> = {
    TODO: tasks.filter(t => t.status === 'TODO'),
    IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS'),
    DONE: tasks.filter(t => t.status === 'DONE'),
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveTask(active.data.current as Task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const currentStatus = active.data.current?.status;
    const newStatus = over.id as TaskStatus;

    if (currentStatus && currentStatus !== newStatus) {
      updateStatus(taskId, newStatus);
      toast.success(`Moved to ${newStatus.replace('_', ' ')}`);
    }
  };

  return (
    <div className="p-8 h-screen flex flex-col bg-gray-50/50"> {/* 加个背景色稍微好看点 */}
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Good Morning, {user?.firstName || 'User'}! ☀️
          </h1>
          <p className="text-gray-500 mt-1">
            You have <span className="font-semibold text-blue-600">{pendingCount}</span> tasks remaining.
          </p>
        </div>

        {/* ✨✨✨ 修改这里：把按钮包在一个 div 里 */}
        <div className="flex items-center gap-3">
          <CreateTaskDialog onSuccess={refreshTasks} />

          <Button
            variant="outline"
            onClick={logout}
            className="text-gray-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200"
            title="Sign out"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* 下面的代码不变 */}
      <div className="flex-1 overflow-x-auto">
        {isLoading ? (
          <div className="text-center py-10 text-gray-400">Loading tasks...</div>
        ) : (
          <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-w-[800px]">

              {(['TODO', 'IN_PROGRESS', 'DONE'] as TaskStatus[]).map((status) => (
                <DroppableColumn
                  key={status}
                  id={status}
                  title={status.replace('_', ' ')}
                  count={columns[status].length}
                  colorClass={
                    status === 'TODO' ? 'bg-gray-400' :
                      status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-green-500'
                  }
                >
                  {columns[status].map((task) => (
                    <DraggableTask
                      key={task._id}
                      task={task}
                      onStatusChange={updateStatus}
                      onDelete={deleteTask}
                      onUpdate={updateTask}
                      onRefresh={refreshTasks}
                    />
                  ))}
                  {columns[status].length === 0 && (
                    <div className="h-24 border-2 border-dashed border-gray-100 rounded-lg flex items-center justify-center text-gray-300 text-sm">
                      Drop here
                    </div>
                  )}
                </DroppableColumn>
              ))}

            </div>

            <DragOverlay>
              {activeTask ? (
                <div className="opacity-90 rotate-2 cursor-grabbing shadow-2xl scale-105">
                  <TaskCard
                    task={activeTask}
                    onStatusChange={() => { }}
                    onDelete={() => { }}
                    onUpdate={async () => { }}
                    onRefresh={() => { }}
                  />
                </div>
              ) : null}
            </DragOverlay>

          </DndContext>
        )}
      </div>
    </div>
  );
}