"use client";

// ✨ 1. 强制动态渲染，解决 Vercel 构建报错
export const dynamic = 'force-dynamic';

import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { DraggableTask } from "@/components/tasks/draggable-task";
import { DroppableColumn } from "@/components/tasks/droppable-column";
import { TaskCard } from "@/components/tasks/task-card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useTasks } from "@/hooks/use-tasks";
// ✨ 2. 引入我们精心封装的 Hook
import { useDashboardLogic } from "@/hooks/use-dashboard-logic";
import { TaskStatus } from "@/types/task";
import {
    DndContext,
    DragOverlay,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import { Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
// 引入 socket 主要是为了登出时断开连接
import { socket } from "@/lib/socket";

function DashboardContent() {
    const router = useRouter();

    // ✨ 3. 从 useTasks 中解构出 activeWorkspaceId
    const {
        tasks,
        isLoading: tasksLoading,
        updateStatus,
        deleteTask,
        refreshTasks,
        updateTask,
        activeWorkspaceId,
        updateTaskLocally // ✨ 从 useTasks 拿出来
    } = useTasks();

    const { user, logout, isLoading: authLoading } = useAuth();

    // ✨✨✨ 4. 见证奇迹：用一行 Hook 替代原本所有的复杂状态和拖拽逻辑！
    const { activeTask, handleDragStart, handleDragEnd } = useDashboardLogic(
        user,
        updateStatus,
        activeWorkspaceId, // 把当前房间号传给 Socket
        updateTaskLocally // ✨ 从 useTasks 拿出来
    );

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
    );

    // --- 路由保护 ---
    useEffect(() => {
        if (!user && authLoading !== true) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    // --- 防闪烁拦截 ---
    if (!user || authLoading === true) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3 text-gray-500">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <p className="text-sm font-medium">Checking authentication...</p>
                </div>
            </div>
        );
    }

    const pendingCount = tasks?.filter(t => t.status !== 'DONE').length || 0;

    const columns: Record<string, typeof tasks> = {
        TODO: tasks?.filter(t => t.status === 'TODO') || [],
        IN_PROGRESS: tasks?.filter(t => t.status === 'IN_PROGRESS') || [],
        DONE: tasks?.filter(t => t.status === 'DONE') || [],
    };

    // 包装登出逻辑，顺便断开 WebSocket
    const handleLogout = () => {
        socket.disconnect();
        logout();
    };

    return (
        <div className="p-8 h-screen flex flex-col bg-gray-50/50">
            <div className="flex items-center justify-between mb-8 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Good Morning, {user?.firstName || 'User'}! ☀️
                    </h1>
                    <p className="text-gray-500 mt-1">
                        You have <span className="font-semibold text-blue-600">{pendingCount}</span> tasks remaining.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <CreateTaskDialog onSuccess={refreshTasks} />
                    <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="text-gray-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200"
                        title="Sign out"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto">
                {tasksLoading ? (
                    <div className="flex items-center justify-center h-64 text-gray-400">
                        <Loader2 className="h-8 w-8 animate-spin mr-2" />
                        Loading tasks...
                    </div>
                ) : (
                    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-w-[800px]">
                            {(['TODO', 'IN_PROGRESS', 'DONE'] as TaskStatus[]).map((status) => (
                                <DroppableColumn
                                    key={status}
                                    id={status}
                                    title={status.replace('_', ' ')}
                                    count={columns[status]?.length || 0}
                                    colorClass={
                                        status === 'TODO' ? 'bg-gray-400' :
                                            status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-green-500'
                                    }
                                >
                                    {columns[status]?.map((task) => (
                                        <DraggableTask
                                            key={task._id}
                                            task={task}
                                            onStatusChange={updateStatus}
                                            onDelete={deleteTask}
                                            onUpdate={updateTask}
                                            onRefresh={refreshTasks}
                                        />
                                    ))}
                                    {columns[status]?.length === 0 && (
                                        <div className="h-24 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm bg-gray-50">
                                            Drop tasks here
                                        </div>
                                    )}
                                </DroppableColumn>
                            ))}
                        </div>

                        <DragOverlay>
                            {activeTask ? (
                                <div className="opacity-90 rotate-2 cursor-grabbing shadow-2xl scale-105 pointer-events-none">
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

export default DashboardContent;