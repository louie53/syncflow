import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react'; // 图标库
import { useState } from 'react';

interface TaskInputProps {
    onAdd: (title: string) => Promise<boolean | void>;
}

export function TaskInput({ onAdd }: TaskInputProps) {
    const [title, setTitle] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsSubmitting(true);
        await onAdd(title);
        setTitle('');
        setIsSubmitting(false);
    };

    return (
        <div className="mb-8">
            <form onSubmit={handleSubmit} className="flex gap-3 items-center">
                <div className="relative flex-1">
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Add a new task..."
                        className="h-12 pl-4 text-base bg-white shadow-sm border-gray-200 focus-visible:ring-2 focus-visible:ring-blue-500 transition-all hover:border-blue-300"
                    />
                </div>
                <Button
                    type="submit"
                    disabled={!title.trim() || isSubmitting}
                    className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
                >
                    {isSubmitting ? (
                        <span className="animate-spin mr-2">⏳</span>
                    ) : (
                        <Plus className="w-5 h-5 mr-1" />
                    )}
                    Add Task
                </Button>
            </form>
        </div>
    );
}