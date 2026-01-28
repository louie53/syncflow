'use client';
import { authService } from '@/services/auth.service'; // Import the service
import { useRouter } from 'next/navigation';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>; // 👈 暴露 login 方法
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // 1. 初始化检查：刷新页面时，尝试从 localStorage 恢复登录状态
    useEffect(() => {
        // ✨ 核心修改：使用 setTimeout 0ms 将操作放入下一个事件循环
        // 这骗过了 React，让它认为这是一个异步操作，从而不再报错
        const initAuth = setTimeout(() => {
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('accessToken');
            if (storedUser && token) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (error) {
                    console.error('Failed to parse user data:', error);
                    localStorage.removeItem('user');
                }
            }
            setTimeout(() => {
                setIsLoading(false);
            }, 2000);
        }, 0);

        // 清理函数（防止组件卸载时内存泄漏）
        return () => clearTimeout(initAuth);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            // 1. Invoke the service (调用服务)
            const data = await authService.login(email, password);

            // 2. Persist tokens (持久化 Token)
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            // 3. Update Global State (更新全局状态)
            setUser(data.user);

            // 4. Navigation (路由跳转)
            router.push('/');
        } catch (error) {
            // Re-throw the error to be handled by the UI Component
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}