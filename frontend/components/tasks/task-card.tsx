"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { Task, TaskPriority, TaskStatus } from '@/types/task';
// 👇 引入 Pencil 图标
import { CheckCircle2, Circle, Clock, MoreVertical, Pencil, RotateCcw, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { EditTaskDialog } from "./edit-task-dialog";

interface TaskCardProps {
    task: Task;
    onStatusChange: (id: string, status: TaskStatus) => void;
    onDelete: (id: string) => void;
    // 👇 修复了这里：不再使用 any，而是明确指定可以更新的字段
    onUpdate?: (id: string, data: { title: string; description?: string; priority?: TaskPriority }) => Promise<void>;
}

const statusStyles = {
    TODO: { icon: Circle, color: 'text-gray-400', badge: 'bg-gray-100 text-gray-600 hover:bg-gray-200' },
    IN_PROGRESS: { icon: Clock, color: 'text-blue-500', badge: 'bg-blue-100 text-blue-600 hover:bg-blue-200' },
    DONE: { icon: CheckCircle2, color: 'text-green-500', badge: 'bg-green-100 text-green-600 hover:bg-green-200' },
};

export function TaskCard({ task, onStatusChange, onDelete, onUpdate }: TaskCardProps) {
    const { icon: StatusIcon, color, badge } = statusStyles[task.status] || statusStyles.TODO;
    const isDone = task.status === 'DONE';

    // 👇 控制编辑弹窗的状态
    const [isEditOpen, setIsEditOpen] = useState(false);

    const handleNextStatus = () => {
        if (isDone) return;

        const nextMap: Record<string, TaskStatus> = {
            'TODO': 'IN_PROGRESS',
            'IN_PROGRESS': 'DONE',
        };

        const nextStatus = nextMap[task.status];
        if (nextStatus) {
            onStatusChange(task._id, nextStatus);
        }
    };

    return (
        <>
            <Card className={cn(
                "w-full flex flex-row items-center justify-between p-4 transition-all duration-200 hover:shadow-md border-gray-100",
                isDone && "bg-gray-50/50"
            )}>
                {/* 左侧区域 */}
                <div className="flex items-center gap-4 min-w-0 flex-1 mr-4">
                    <button
                        onClick={handleNextStatus}
                        disabled={isDone}
                        className={cn(
                            "transition-transform p-1 rounded-full shrink-0",
                            color,
                            !isDone ? "hover:bg-gray-100 active:scale-90 cursor-pointer" : "cursor-not-allowed opacity-80"
                        )}
                    >
                        <StatusIcon className="w-6 h-6" />
                    </button>

                    <div className="flex flex-col gap-1 min-w-0">
                        <span className={cn(
                            "font-medium text-gray-900 transition-all select-none truncate",
                            isDone && "text-gray-400 line-through decoration-gray-300"
                        )}>
                            {task.title}
                        </span>
                        <div className="flex gap-2 items-center">
                            <Badge variant="secondary" className={cn("text-[10px] h-5 px-2 font-medium uppercase tracking-wider shrink-0", badge)}>
                                {task.status.replace('_', ' ')}
                            </Badge>

                            {/* 显示优先级 (如果有的话) */}
                            {task.priority && (
                                <Badge variant="outline" className="text-[10px] h-5 px-2 uppercase tracking-wider shrink-0 border-gray-200 text-gray-500">
                                    {task.priority}
                                </Badge>
                            )}

                            <span className="text-[10px] text-gray-400 flex items-center shrink-0">
                                {new Date(task.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 右侧菜单区域 */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 text-gray-500 hover:text-gray-900 hover:bg-gray-100 shrink-0"
                        >
                            <MoreVertical className="w-5 h-5" />
                            <span className="sr-only">Menu</span>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-40 bg-white shadow-lg border-gray-100">
                        {/* ✨ Edit 按钮 */}
                        <DropdownMenuItem
                            onClick={() => setIsEditOpen(true)}
                            className="cursor-pointer font-medium text-gray-700 focus:bg-gray-50"
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>

                        {isDone && (
                            <DropdownMenuItem
                                onClick={() => onStatusChange(task._id, 'TODO')}
                                className="cursor-pointer text-blue-600 focus:text-blue-700 focus:bg-blue-50"
                            >
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Mark as Todo
                            </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            onClick={() => onDelete(task._id)}
                            className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </Card>

            {/* ✨ 渲染弹窗 (只有当 onUpdate 存在时才渲染) */}
            {onUpdate && (
                <EditTaskDialog
                    task={task}
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    onUpdate={onUpdate}
                />
            )}
        </>
    );
}