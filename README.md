# SyncFlow Backend 🚀

这是一个基于 Node.js, Express 和 TypeScript 构建的高并发数据同步系统后端。
这是我跟着 Tech Lead (AI) 进行的 30 天全栈开发实战项目。

## 🛠 技术栈

- **Runtime:** Node.js (v20+)
- **Language:** TypeScript
- **Framework:** Express
- **Database:** MongoDB 8.0 (Dockerized)
- **Cache:** Redis (Dockerized)
- **Tools:** Docker Compose, Zod, Mongoose

## 🚀 快速开始

- POST /api/auth/register - 用户注册

### 1. 环境准备
确保你的电脑安装了：
- Docker & Docker Desktop
- Node.js (v20+)

### 2. 安装依赖
```bash
npm install

## 🛠 常用开发命令

### 1. 启动/停止环境 (Docker)
我们要先启动数据库，代码才能跑起来。
```bash
# 🟢 启动数据库 & 缓存 (后台运行)
npm run docker:db

# 🔴 停止并删除容器 (下班时用)
npm run docker:down

# 🦄 启动开发服务器 (支持热更新)
npm run dev

# 🏗 编译 TypeScript 代码 (发布前用)
npm run build