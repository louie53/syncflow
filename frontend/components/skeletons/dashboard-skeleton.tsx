export function DashboardSkeleton() {
    return (
        <div className="flex h-screen w-full bg-white overflow-hidden">
            {/* 1. 左侧 Sidebar 骨架 */}
            <div className="hidden md:flex w-64 flex-col border-r border-gray-200 bg-gray-50/50 p-4 space-y-6">
                {/* 模拟 Logo */}
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />

                {/* 模拟菜单项 (多画几条) */}
                <div className="space-y-3 mt-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-10 w-full bg-gray-200/50 rounded-lg animate-pulse" />
                    ))}
                </div>

                {/* 模拟底部用户信息 */}
                <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="h-12 w-full bg-gray-200/50 rounded-lg animate-pulse" />
                </div>
            </div>

            {/* 2. 右侧主内容区域 */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header 骨架 */}
                <div className="h-16 border-b border-gray-200 flex items-center justify-between px-8 bg-white">
                    <div className="h-6 w-48 bg-gray-100 rounded animate-pulse" />
                    <div className="h-10 w-10 rounded-full bg-gray-100 animate-pulse" />
                </div>

                {/* 看板内容骨架 */}
                <div className="p-8 flex-1 bg-gray-50/30">
                    {/* 标题 */}
                    <div className="h-8 w-64 bg-gray-200 rounded mb-8 animate-pulse" />

                    {/* 三列任务栏 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100%-4rem)]">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex flex-col space-y-4">
                                {/* 列头 */}
                                <div className="h-10 w-full bg-gray-200/80 rounded-lg animate-pulse" />
                                {/* 任务卡片 */}
                                <div className="flex-1 bg-gray-100/50 rounded-xl border border-dashed border-gray-200 animate-pulse p-4 space-y-4">
                                    <div className="h-24 bg-white rounded-lg shadow-sm opacity-50" />
                                    <div className="h-24 bg-white rounded-lg shadow-sm opacity-50" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}