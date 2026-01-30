"use client";

import { Task, TaskPriority, TaskStatus } from "@/types/task";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { TaskCard } from "./task-card";

interface DraggableTaskProps {
    task: Task;
    onStatusChange: (id: string, status: TaskStatus) => void;
    onDelete: (id: string) => void;
    onUpdate: (id: string, data: { title: string; description?: string; priority?: TaskPriority }) => Promise<void>;
    onRefresh: () => void;
}

export function DraggableTask({ task, onStatusChange, onDelete, onUpdate, onRefresh }: DraggableTaskProps) {
    // ✨ 判断是否已完成
    const isDone = task.status === 'DONE';

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task._id,
        data: { ...task },
        // ✨✨✨ 核心修改：如果是 DONE 状态，禁用拖拽功能
        disabled: isDone,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        // 拖拽时隐藏原卡片(0)，平时显示(1)
        opacity: isDragging ? 0 : 1,
        touchAction: "none",
        transformOrigin: "0 0",
        // ✨✨✨ 样式优化：
        // 1. 如果是 Done，鼠标变成默认箭头，否则是小手
        // 2. 如果是 Done，稍微变淡一点，表示"归档/不可动"
        cursor: isDone ? "default" : "grab",
        filter: isDone ? "grayscale(10%) opacity(0.8)" : "none",
    };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <TaskCard
                task={task}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
                onUpdate={onUpdate}
                onRefresh={onRefresh}
            />
        </div>
    );
}