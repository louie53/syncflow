"use client";

import { Button } from "@/components/ui/button"; // ✅ 确保这里引入了 Button
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTasks } from "@/hooks/use-tasks";
import { Task, TaskPriority } from "@/types/task";
import { Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CreateTaskDialogProps {
    onSuccess: () => void;
    taskToEdit?: Task;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function CreateTaskDialog({ onSuccess, taskToEdit, open, onOpenChange }: CreateTaskDialogProps) {
    // 内部状态 (如果是新建模式，用这个控制显隐)
    const [internalOpen, setInternalOpen] = useState(false);

    // 判断是"受控模式(Edit)"还是"自控模式(Create)"
    // 如果 open 属性存在 (不为 undefined)，说明是受控模式 (Edit)
    const isControlled = open !== undefined;

    // 真正使用的开关状态
    const showOpen = isControlled ? open : internalOpen;
    const setShowOpen = isControlled ? onOpenChange! : setInternalOpen;

    const { createTask, updateTask } = useTasks();
    const [isLoading, setIsLoading] = useState(false);

    // 表单状态
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<TaskPriority>("MEDIUM");

    // 当 taskToEdit 变化或弹窗打开时，填充表单
    useEffect(() => {
        if (showOpen && taskToEdit) {
            setTitle(taskToEdit.title);
            setDescription(taskToEdit.description || "");
            setPriority(taskToEdit.priority || "MEDIUM");
        } else if (showOpen && !taskToEdit) {
            // 如果是新建模式打开，重置表单
            setTitle("");
            setDescription("");
            setPriority("MEDIUM");
        }
    }, [showOpen, taskToEdit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsLoading(true);
        try {
            if (taskToEdit) {
                // 编辑逻辑
                await updateTask(taskToEdit._id, { title, description, priority });
                toast.success("Task updated");
            } else {
                // 创建逻辑 (不需要传 status，默认为 TODO)
                await createTask({ title, description, priority });
                toast.success("Task created");
            }

            setShowOpen(false);
            onSuccess();

            // 重置表单
            if (!taskToEdit) {
                setTitle("");
                setDescription("");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={showOpen} onOpenChange={setShowOpen}>
            {/* ✨✨✨ 修复重点 ✨✨✨
         只有在"非受控模式" (也就是在 Header 上作为新建按钮使用时)
         才渲染这个 DialogTrigger。
         
         Edit 模式下，触发器在 DropdownMenu 里，所以这里不需要 Trigger。
      */}
            {!isControlled && (
                <DialogTrigger asChild>
                    {/* 这里显式加上 bg-blue-600 确保它是蓝色的，防止默认样式被覆盖 */}
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                        <Plus className="w-4 h-4 mr-2" />
                        New Task
                    </Button>
                </DialogTrigger>
            )}

            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>
                        {taskToEdit ? "Edit Task" : "Create New Task"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input
                            placeholder="What needs to be done?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isLoading}
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                            placeholder="Add details..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={isLoading}
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Priority</label>
                        <Select
                            value={priority}
                            onValueChange={(v) => setPriority(v as TaskPriority)}
                            disabled={isLoading}
                        >
                            <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                <SelectItem value="LOW">Low</SelectItem>
                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                <SelectItem value="HIGH">High</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setShowOpen(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading || !title.trim()} className="bg-black text-white hover:bg-gray-800">
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {taskToEdit ? "Save Changes" : "Create Task"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}