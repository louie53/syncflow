import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils'; // Shadcn 自带的工具函数，用于合并类名
import { Task, TaskStatus } from '@/types/task';
import { CheckCircle2, Circle, Clock, Trash2 } from 'lucide-react';

interface TaskCardProps {
    task: Task;
    onStatusChange: (id: string, status: TaskStatus) => void;
    onDelete: (id: string) => void;
}

// 状态对应的样式配置
const statusStyles = {
    TODO: { icon: Circle, color: 'text-gray-400', badge: 'bg-gray-100 text-gray-600 hover:bg-gray-200' },
    IN_PROGRESS: { icon: Clock, color: 'text-blue-500', badge: 'bg-blue-100 text-blue-600 hover:bg-blue-200' },
    DONE: { icon: CheckCircle2, color: 'text-green-500', badge: 'bg-green-100 text-green-600 hover:bg-green-200' },
};

export function TaskCard({ task, onStatusChange, onDelete }: TaskCardProps) {
    const { icon: StatusIcon, color, badge } = statusStyles[task.status] || statusStyles.TODO;

    const handleNextStatus = () => {
        const nextMap: Record<string, TaskStatus> = {
            'TODO': 'IN_PROGRESS',
            'IN_PROGRESS': 'DONE',
            'DONE': 'TODO',
        };
        onStatusChange(task._id, nextMap[task.status]);
    };

    return (
        <Card className={cn(
            "group flex items-center justify-between p-4 transition-all duration-200 hover:shadow-md border-gray-100",
            task.status === 'DONE' && "bg-gray-50/50"
        )}>
            <div className="flex items-center gap-4 flex-1">
                {/* 状态按钮 */}
                <button
                    onClick={handleNextStatus}
                    className={cn("transition-transform active:scale-90", color)}
                >
                    <StatusIcon className="w-6 h-6" />
                </button>

                <div className="flex flex-col gap-1">
                    <span className={cn(
                        "font-medium text-gray-900 transition-all",
                        task.status === 'DONE' && "text-gray-400 line-through decoration-gray-300"
                    )}>
                        {task.title}
                    </span>
                    <div className="flex gap-2">
                        <Badge variant="secondary" className={cn("text-[10px] h-5 px-2 font-medium uppercase tracking-wider", badge)}>
                            {task.status.replace('_', ' ')}
                        </Badge>
                        <span className="text-[10px] text-gray-400 flex items-center">
                            Created {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* 删除按钮 (只在 Hover 时显示) */}
            <button
                onClick={() => onDelete(task._id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </Card>
    );
}