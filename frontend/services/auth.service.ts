// 👇 Import the shared instance
import { apiClient } from '@/lib/api-client';
interface RegisterParams {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}
export const authService = {
    login: async (email: string, password: string) => {
        // 这里的 URL 只需要写后缀
        // Full URL will be: http://localhost:4000/api/auth/login
        const response = await apiClient.post('/auth/login', {
            email,
            password,
        });
        return response.data;
    },
    register: async (data: RegisterParams) => {
        // 假设你的后端注册接口是 /auth/signup
        const response = await apiClient.post('/auth/register', data);
        return response.data;
    },
};