"use client";

import { useDroppable } from "@dnd-kit/core";

interface DroppableColumnProps {
    id: string; // 比如 'TODO', 'DONE'
    children: React.ReactNode;
    title: string;
    count: number;
    colorClass: string;
}

export function DroppableColumn({ id, children, title, count, colorClass }: DroppableColumnProps) {
    // useDroppable 钩子：让这个组件变成放置目标
    const { setNodeRef, isOver } = useDroppable({
        id: id,
    });

    // 当有东西拖到这个列上方时，稍微变色提示用户
    const bgClass = isOver ? "bg-blue-50/80 ring-2 ring-blue-400" : "bg-gray-50/50";

    return (
        <div
            ref={setNodeRef}
            className={`flex flex-col h-full rounded-xl border border-gray-200 transition-colors ${bgClass}`}
        >
            {/* 列标题 */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-xl">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${colorClass}`} />
                    <h3 className="font-semibold text-gray-700 text-sm">{title}</h3>
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                        {count}
                    </span>
                </div>
            </div>

            {/* 列内容 */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3">
                {children}
            </div>
        </div>
    );
}