import { Router } from 'express';
import { createWorkspace, getMyWorkspaces } from '../controllers/workspace.controller';
import { authMiddleware } from '../middlewares/auth.middleware'; // 确保路径对

const router = Router();

// 🔒 所有 Workspace 相关的操作都需要登录，所以先过 authMiddleware
router.use(authMiddleware);

// POST /api/workspaces -> 创建工作区
router.post('/', createWorkspace);

// GET /api/workspaces -> 获取我的工作区列表
router.get('/', getMyWorkspaces);

export default router;