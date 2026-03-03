// frontend/lib/socket.ts
import { io } from 'socket.io-client';

// 1. 拿到原始的带有 /api 的 URL (比如 http://localhost:4000/api)
const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// 2. ✨ 把末尾的 /api 砍掉，只保留 http://localhost:4000
const SOCKET_URL = rawUrl.replace(/\/api\/?$/, '');

export const socket = io(SOCKET_URL, {
    autoConnect: false, // 等用户登录后再手动连接
    withCredentials: true,
});