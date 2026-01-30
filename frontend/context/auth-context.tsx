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

// ✨ 定义注册需要的数据类型
interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    // ✨ 新增 register 方法定义
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // 1. 初始化检查
    useEffect(() => {
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
            }, 500); //稍微缩短了一点等待时间，体验会好一点
        }, 0);

        return () => clearTimeout(initAuth);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const data = await authService.login(email, password);
            localStorage.setItem('accessToken', data.accessToken);
            // 如果后端没返 refreshToken，这里可能会报错，建议加个判断
            if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            router.push('/');
        } catch (error) {
            throw error;
        }
    };

    // ✨✨✨ 新增：注册方法实现
    const register = async (registerData: RegisterData) => {
        try {
            // 1. 调用 Service 里的注册方法
            // (注意：这里假设 authService.register 返回的数据结构和 login 一样，包含 accessToken 和 user)
            const data = await authService.register(registerData);

            // 2. 注册成功后直接"自动登录" (保存 Token)
            localStorage.setItem('accessToken', data.accessToken);
            if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('user', JSON.stringify(data.user));

            // 3. 更新全局状态
            setUser(data.user);

            // 4. 跳转 Dashboard
            router.push('/');
        } catch (error) {
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
        // ✨ 别忘了把 register 加到 value 里
        <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
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