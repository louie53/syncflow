// 👇 Import the shared instance
import { apiClient } from '@/lib/api-client';

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
};