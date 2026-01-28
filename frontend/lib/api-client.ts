import axios from 'axios';

// 1. 定义 Base URL
// 优先读环境变量，如果没有（比如本地开发），默认回退到 localhost:4000
// 这样就算你忘了配 .env，项目也能跑起来
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const apiClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. 请求拦截器 (Request Interceptor)
apiClient.interceptors.request.use(
    (config) => {
        // 🛑 关键修复：增加 (typeof window !== 'undefined') 判断
        // Next.js 有时会在服务端预渲染，服务端没有 localStorage，直接调用会报错
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. 响应拦截器 (Response Interceptor)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // 🛑 全局 401 处理：Token 过期或无效时，自动登出
        if (error.response?.status === 401) {
            console.warn('🔒 Unauthorized: Token invalid or expired.');

            if (typeof window !== 'undefined') {
                // 1. 清除本地脏数据
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');

                // 2. 强制跳转回登录页
                // 注意：这里不能用 Next.js 的 useRouter，因为这不是 React 组件
                // 使用 window.location.href 是最安全的方法
                // 只有当当前不在登录页时才跳转，防止无限刷新
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

// 使用命名导出 (Named Export) 通常比 Default Export 更容易重构
export { apiClient };
