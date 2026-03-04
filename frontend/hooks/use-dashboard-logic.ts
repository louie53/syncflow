import { socket } from "@/lib/socket";
import { Task, TaskStatus } from "@/types/task";
import { User } from "@/types/user";
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { toast } from "sonner";
// ✨ 定义广播数据的标准结构，拒绝 any
interface TaskMovedData {
    taskId: string;
    newStatus: TaskStatus;
    userName: string;
    workspaceId: string;
}
export function useDashboardLogic(
    user: User | null,
    updateStatus: (id: string, status: TaskStatus) => void,
    activeWorkspaceId: string | null,
    updateTaskLocally: (id: string, status: TaskStatus) => void
) {
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    // ✨✨✨ 1. 专门管理“房间机制”（坚若磐石，绝不乱退群）
    useEffect(() => {
        if (!activeWorkspaceId) return;

        if (!socket.connected) socket.connect();

        const joinRoom = () => {
            console.log("🏠 申请加入房间:", activeWorkspaceId);
            socket.emit("join_workspace", {
                workspaceId: activeWorkspaceId,
                userName: user?.firstName || "A team member"
            });
        };

        // 如果已经连接，直接进房间
        if (socket.connected) {
            joinRoom();
        }

        // 监听断线重连，自动重回房间
        socket.on("connect", joinRoom);

        // 只有当 activeWorkspaceId 改变（切换工作区），或者组件彻底卸载时，才离开旧房间
        return () => {
            console.log("👋 离开房间:", activeWorkspaceId);
            socket.off("connect", joinRoom);
            socket.emit("leave_workspace", activeWorkspaceId);
        };
    }, [activeWorkspaceId]); // 👈 秘诀：只依赖 ID！


    // ✨✨✨ 2. 专门管理“广播监听”（哪怕重新绑定，也不会导致退群）
    useEffect(() => {
        const handleTaskMoved = (data: TaskMovedData) => {
            console.log("🎉 收到远端广播！", data);
            // 本地静默更新 UI，不需要再去查数据库
            updateTaskLocally(data.taskId, data.newStatus);
            toast.info(`Task moved to ${data.newStatus.replace('_', ' ')} by ${data.userName}`);
        };
        // ✨ 新增：处理新用户加入的监听
        const handleUserJoined = (data: { userName: string }) => {
            console.log("👋 收到进房通知:", data);
            toast.success(`${data.userName} joined the workspace! 🟢`);
        };
        // 绑定监听
        socket.on("task_moved_broadcast", handleTaskMoved);
        socket.on("user_joined_broadcast", handleUserJoined); // 👈 给雷达通电！

        return () => {
            // 清理监听
            socket.off("task_moved_broadcast", handleTaskMoved);
        };
    }, [updateTaskLocally]); // 👈 秘诀：只依赖本地更新函数


    // 3. 处理拖拽逻辑
    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveTask(active.data.current?.task as Task);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveTask(null);

        if (!over) return;

        const taskId = active.id as string;
        const currentStatus = active.data.current?.task?.status;
        const newStatus = over.id as TaskStatus;

        if (currentStatus && currentStatus !== newStatus) {
            // 1. 发起 API 请求更新数据库
            updateStatus(taskId, newStatus);

            // 2. 发送 Socket 广播通知房间里的其他人
            socket.emit("task_moved", {
                taskId,
                newStatus,
                userName: user?.firstName || "Someone",
                workspaceId: activeWorkspaceId
            });
        }
    };

    return {
        activeTask,
        handleDragStart,
        handleDragEnd,
        socketConnected: socket.connected
    };
}