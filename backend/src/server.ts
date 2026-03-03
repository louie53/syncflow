import http from 'http'; // ✨ 新增：引入 http 模块
import mongoose from 'mongoose';
import { Server } from 'socket.io'; // ✨ 新增：引入 Socket.io
import app from './app'; // 使用相对路径
import { config } from './config/env'; // 使用相对路径

// ✨ 1. 创建 HTTP 服务器并包装 Express app
const server = http.createServer(app);

// ✨ 2. 初始化 Socket.io 实例并配置 CORS
const io = new Server(server, {
    cors: {
        origin: function (origin, callback) {
            // 允许没有 origin 的请求 (比如 Postman 等后端调用)
            if (!origin) return callback(null, true);
            // 允许本地开发和 Vercel 部署环境
            if (origin.includes('localhost') || origin.includes('.vercel.app')) {
                return callback(null, true);
            }
            callback(new Error('Not allowed by CORS'));
        },
        credentials: true
    }
});

// ✨ 3. 监听客户端的 WebSocket 连接
io.on('connection', (socket) => {
    console.log(`🟢 客户端已连接! Socket ID: ${socket.id}`);
    // 🪄 魔法 1：监听用户加入特定的工作区房间
    socket.on('join_workspace', (workspaceId: string) => {
        if (!workspaceId) return;
        socket.join(workspaceId);
        console.log(`🏠 Socket [${socket.id}] 加入了工作区: ${workspaceId}`);
    });

    // (可选) 监听用户离开房间，比如切换工作区时
    socket.on('leave_workspace', (workspaceId: string) => {
        if (!workspaceId) return;
        socket.leave(workspaceId);
        console.log(`👋 Socket [${socket.id}] 离开了工作区: ${workspaceId}`);
    });

    // 🪄 魔法 2：监听任务拖拽/状态更新事件
    // 假设前端传来的 data 长这样: { taskId, newStatus, userName, workspaceId }
    socket.on('task_moved', (data) => {
        console.log(`📦 收到任务移动事件:`, data);

        if (data.workspaceId) {
            // ✨ 核心广播逻辑：使用 .to(room) 只发给这个房间里的**其他人** (不包含发送者自己)
            socket.to(data.workspaceId).emit('task_moved_broadcast', {
                taskId: data.taskId,
                newStatus: data.newStatus,
                userName: data.userName
            });
            console.log(`📣 已向工作区 ${data.workspaceId} 广播了任务移动`);
        } else {
            console.warn("⚠️ 收到 task_moved 事件，但缺少 workspaceId，无法精确广播！");
        }
    });

    socket.on('disconnect', () => {
        console.log(`🔴 客户端已断开! Socket ID: ${socket.id}`);
    });
});

const startServer = async () => {
    try {
        // 1. 连接数据库
        console.log('⏳ Connecting to MongoDB...');
        await mongoose.connect(config.MONGO_URI);
        console.log('✅ MongoDB Connected Successfully!');

        // 2. 启动服务 
        // 🚨 极其重要：这里已经从 app.listen 改成了 server.listen
        server.listen(config.PORT, () => {
            console.log(`🚀 Server running on http://localhost:${config.PORT}`);
        });

    } catch (error) {
        console.error('❌ Error starting server:', error);
        process.exit(1);
    }
};

startServer();

// ✨ 4. 导出 io 实例，方便后续在 Controller 或 Service 中使用
export { io };
