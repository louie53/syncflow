// frontend/types/user.ts

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    // 以后可以扩展头像、角色等
    avatar?: string;
    role?: 'ADMIN' | 'USER';
}

export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

// 如果登录返回的数据结构是固定的，也可以定义在这里
export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken?: string;
}

export interface RegisterParams {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

// 登录时发送给后端的数据 (顺手也定义了)
export interface LoginData {
    email: string;
    password: string;
}

