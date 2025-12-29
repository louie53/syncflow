// src/app/login/page.tsx
'use client'; // 👈 必须加这个！因为我们要使用 useState (用户交互)
import axios, { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation'; // 注意是 next/navigation，不是 next/router
import { useState } from 'react';

export default function LoginPage() {
    const router = useRouter();

    // State: 管理用户输入
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Handle Login Logic
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // 阻止表单默认刷新页面
        setError('');
        setLoading(true);

        try {
            // 🚀 发送请求给你的后端
            // 假设你的后端运行在 3000 或 4000 端口，请根据实际情况修改 URL
            // 这里假设后端是 http://localhost:3000
            const response = await axios.post('http://localhost:3000/api/auth/login', {
                email,
                password,
            });

            // ✅ 登录成功
            const { accessToken, user } = response.data;

            console.log('Login Success:', user);

            // 💾 存储 Token (暂时存在 localStorage，后面我们可以优化为 Cookie)
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('user', JSON.stringify(user));

            // 🔀 跳转到首页
            router.push('/');

        } catch (err) {
            // 1. 先打印原始错误，方便调试
            console.error('Login Failed:', err);

            let message = 'Something went wrong. Please try again.';

            // 2. 使用类型守卫判断：这是不是一个 Axios 错误？
            if (isAxiosError(err)) {
                // ✅ 在这个 if 里面，TS 知道 err 是 AxiosError 类型
                // 所以它可以安全地访问 response.data
                message = err.response?.data?.message || message;
            }

            // 3. 设置错误信息
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to SyncFlow
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{' '}
                        <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                            create a new account
                        </a>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                required
                                className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Error Message Display */}
                    {error && (
                        <div className="text-sm text-red-500 text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}