"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTasks } from "@/hooks/use-tasks";
import { Plus } from "lucide-react";
import { useState } from "react";


// 👇 1. 定义接口，接收 onSuccess 回调
interface CreateTaskDialogProps {
    onSuccess?: () => void;
}

export function CreateTaskDialog({ onSuccess }: CreateTaskDialogProps) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("MEDIUM");
    const [loading, setLoading] = useState(false);

    const { createTask } = useTasks();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setLoading(true);
        // 调用 Hook 创建任务
        const success = await createTask({
            title,
            description,
            priority // 如果你后端没加 priority 字段，暂时可以先传，后端会忽略，不影响
        });

        setLoading(false);

        if (success) {
            setOpen(false);
            setTitle("");
            setDescription("");
            setPriority("MEDIUM");
        }

        // 👇 3. 关键点：创建成功后，通知父组件刷新
        if (onSuccess) {
            onSuccess();
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Task
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    {/* 任务标题 */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Task Title <span className="text-red-500">*</span></Label>
                        <Input
                            id="title"
                            placeholder="e.g. Fix login bug"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    {/* 优先级选择 */}
                    <div className="space-y-2">
                        <Label>Priority</Label>
                        <Select value={priority} onValueChange={setPriority}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="LOW">Low</SelectItem>
                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                <SelectItem value="HIGH">High</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 任务描述 */}
                    <div className="space-y-2">
                        <Label htmlFor="desc">Description</Label>
                        <Textarea
                            id="desc"
                            placeholder="Add more details..."
                            className="min-h-[100px]"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!title.trim() || loading}>
                            {loading ? "Creating..." : "Create Task"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}