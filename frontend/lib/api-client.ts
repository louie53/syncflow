import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const apiClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 👇 1. 请求拦截器
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 👇 2. 响应拦截器 (Response Interceptor)
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        console.log("🚨 拦截器捕获到错误:", error.response?.status);

        // 如果是 401 错误，且不是重试请求
        if (error.response?.status === 401 && !originalRequest._retry) {
            console.log("🔄 准备尝试刷新 Token...");
            originalRequest._retry = true;

            try {
                // 1. 检查有没有 Refresh Token
                const refreshToken = localStorage.getItem('refreshToken');
                console.log("📦 本地 Refresh Token:", refreshToken ? "✅ 存在" : "❌ 缺失");

                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }

                // 2. 发送刷新请求
                console.log("🚀 发送 /auth/refresh-token 请求...");
                // ⚠️ 确认这里的路径和参数名与后端完全一致
                const { data } = await axios.post(`${baseURL}/auth/refresh-token`, {
                    token: refreshToken,
                });

                console.log("✅ 刷新成功! 新 Access Token:", data.accessToken ? "获取到了" : "没拿到");

                // 3. 保存新 Token
                localStorage.setItem('accessToken', data.accessToken);

                // 4. 重试原请求
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;

                console.log("🔄 重试原请求...");
                return apiClient(originalRequest);

            } catch (refreshError) {
                console.error("💀 刷新流程失败:", refreshError);

                // 清除数据并跳转
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.location.href = '/login';

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);