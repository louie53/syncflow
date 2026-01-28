import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // 👇 这里的布局只影响 Dashboard 页面，不会影响 Login
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-gray-50/50">
                {children}
            </main>
        </div>
    );
}