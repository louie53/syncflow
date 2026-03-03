"use client";

// ✨ 1. 强制动态渲染，解决 Vercel 构建报错
export const dynamic = 'force-dynamic';

import { Suspense } from "react";
// ✨ 引入我们刚才写好的 socket 实例
import DashboardContent from "@/components/dashboard/dashboard-content";


export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}