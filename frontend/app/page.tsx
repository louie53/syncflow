'use client';

import { TaskCard } from '@/components/tasks/task-card';
import { TaskInput } from '@/components/tasks/task-input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { useTasks } from '@/hooks/use-tasks';
import { CheckCircle2, LayoutDashboard, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { user, isLoading: isAuthLoading, logout } = useAuth();
  const { tasks = [], isLoading: isTasksLoading, createTask, updateStatus, deleteTask } = useTasks();

  // 🛑 守卫 1：Auth Loading
  if (isAuthLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  // 🛑 守卫 2：未登录 -> Landing Page
  if (!user) {
    return (
      // ✨ Landing Page 也加上相对定位，防止光效溢出
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center px-4 relative overflow-hidden">

        {/* ✨ 魔法背景：给 Landing Page 也加一点氛围感 */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-400/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-3xl space-y-8 relative z-10">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
              Master your workflow with <span className="text-primary">SyncFlow</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              The minimalist task manager designed for high-performing teams.
              Organize, prioritize, and get things done.
            </p>
          </div>

          <div className="flex gap-4 justify-center pt-4">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all">
                Get Started
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full">
              Learn More
            </Button>
          </div>
        </div>

        <div className="absolute bottom-8 text-sm text-slate-400">
          © 2025 SyncFlow Inc. built with Next.js 16 & Shadcn/ui
        </div>
      </div>
    );
  }

  // ✅ Dashboard 渲染
  const pendingCount = tasks.filter(t => t.status !== 'DONE').length;

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">

      {/* ✨ 魔法背景区域 (Mesh Gradient) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* 左上角蓝色光晕 */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] opacity-70" />
        {/* 右下角紫色光晕 */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-[100px] opacity-70" />
      </div>

      {/* 🟢 Navbar (z-20 确保在最上层) */}
      <nav className="sticky top-0 z-20 w-full bg-white/70 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl tracking-tight text-slate-900">SyncFlow</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-sm font-medium text-slate-700">{user.email}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Free Plan</span>
            </div>

            <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold border border-primary/20">
              {user.email?.[0].toUpperCase()}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="text-slate-500 hover:text-red-600 hover:bg-red-50"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* 🟢 Main Content (z-10 确保在背景之上，但在 Navbar 之下) */}
      <main className="max-w-3xl mx-auto py-12 px-6 relative z-10">

        <div className="mb-10 space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Good Morning! ☀️
          </h1>
          <p className="text-slate-500 text-lg flex items-center gap-2">
            You have <span className="text-primary font-bold">{pendingCount} tasks</span> remaining today.
            {pendingCount === 0 && <span className="text-green-600 font-medium flex items-center"><CheckCircle2 className="w-4 h-4 mr-1" /> All clear!</span>}
          </p>
        </div>

        <TaskInput onAdd={createTask} />

        {isTasksLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onStatusChange={updateStatus}
              onDelete={deleteTask}
            />
          ))}

          {!isTasksLoading && tasks.length === 0 && (
            <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-xl border border-dashed border-slate-200 shadow-sm">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">No tasks yet</h3>
              <p className="text-slate-500 max-w-sm mx-auto mt-1">
                Your dashboard is looking clean. Add a task above to get started with your day!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}