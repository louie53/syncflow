"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Task, TaskPriority, TaskStatus } from "@/types/task";
import { AlertCircle, Clock, Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { CreateTaskDialog } from "./create-task-dialog";

interface UpdateTaskData {
    title: string;
    description?: string;
    priority?: TaskPriority;
}

interface TaskCardProps {
    task: Task;
    onStatusChange: (id: string, status: TaskStatus) => void;
    onDelete: (id: string) => void;
    onUpdate: (id: string, data: UpdateTaskData) => Promise<void>;
    // ✨ 接收刷新函数
    onRefresh?: () => void;
}

const priorityConfig: Record<TaskPriority, string> = {
    HIGH: "bg-red-50 text-red-700 ring-red-200",
    MEDIUM: "bg-amber-50 text-amber-700 ring-amber-200",
    LOW: "bg-slate-50 text-slate-700 ring-slate-200",
};

export function TaskCard({ task, onStatusChange, onDelete, onUpdate, onRefresh }: TaskCardProps) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const isDone = task.status === 'DONE';
    const currentPriority = task.priority || 'LOW';

    // ✨ 格式化时间函数
    const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        // 显示格式示例: Jan 30, 10:30 PM
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        }).format(date);
    };

    return (
        <>
            <div
                className={`
          group relative p-4 rounded-xl border bg-white shadow-sm hover:shadow-md transition-all duration-200
          ${isDone ? "opacity-60 grayscale-[0.5]" : ""}
        `}
            >
                {/* Header */}
                <div className="flex justify-between items-start gap-2">
                    <h4 className={`font-semibold text-gray-900 leading-tight pt-1 ${isDone ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                    </h4>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`
                  h-8 w-8 -mr-2 shrink-0 transition-colors
                  ${isDone
                                        ? 'bg-gray-200/80 text-black hover:bg-gray-300'
                                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                                    }
                `}
                            >
                                <MoreHorizontal className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-40 bg-white shadow-xl border border-gray-100 z-50">
                            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                            <DropdownMenuRadioGroup
                                value={task.status}
                                onValueChange={(v) => onStatusChange(task._id, v as TaskStatus)}
                            >
                                <DropdownMenuRadioItem value="TODO" className="my-1 cursor-pointer focus:bg-gray-100">To Do</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="IN_PROGRESS" className="my-1 cursor-pointer focus:bg-gray-100">In Progress</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="DONE" className="my-1 cursor-pointer focus:bg-gray-100">Done</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                            <DropdownMenuSeparator className="bg-gray-100" />
                            <DropdownMenuItem onClick={() => setIsEditOpen(true)} className="my-1 cursor-pointer focus:bg-gray-100">
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-red-600 focus:text-red-600 focus:bg-red-50 my-1 cursor-pointer"
                                onClick={() => onDelete(task._id)}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Description */}
                {task.description && (
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                        {task.description}
                    </p>
                )}

                {/* Footer: Priority + Time */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">

                    <span className={`
            text-[10px] font-bold px-2 py-0.5 rounded-full 
            ring-1 ring-inset
            flex items-center gap-1
            ${priorityConfig[currentPriority]} 
          `}>
                        {currentPriority === 'HIGH' && <AlertCircle className="w-3 h-3" />}
                        {currentPriority}
                    </span>

                    {/* ✨ 右侧：显示创建时间 */}
                    {task.createdAt && (
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(task.createdAt)}
                        </span>
                    )}
                </div>
            </div>

            <CreateTaskDialog
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                taskToEdit={task}
                // ✨✨✨ 修复核心：编辑成功后，触发刷新！
                onSuccess={() => {
                    onRefresh?.();
                }}
            />
        </>
    );
}