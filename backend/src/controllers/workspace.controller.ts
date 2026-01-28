import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { AuthRequest } from '../middlewares/auth.middleware'; // 确保这个路径是对的
import { User } from '../models/user.model'; // 引入 User 模型
import { Workspace } from '../models/workspace.model';

/**
 * Handle workspace creation.
 */
export const createWorkspace = async (req: AuthRequest, res: Response) => {
    try {
        const { name } = req.body;
        // 你的中间件里把 id 放在了 userId 上，这很好
        const userId = req.userId;

        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'User not authenticated' });
        }

        if (!name) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Workspace name is required' });
        }

        // 1. 创建工作区 (直接把成员嵌进去，不查别的表)
        const objectUserId = new mongoose.Types.ObjectId(userId);
        const workspace = await Workspace.create({
            name,
            ownerId: objectUserId,
            members: [{
                userId: objectUserId,
                role: 'OWNER', // 创建者直接是 OWNER
                joinedAt: new Date()
            }]
        });

        // 2. 【关键】更新用户的“钥匙串”
        // 把新工作区的 ID 加到 User 的 workspaces 数组里
        await User.findByIdAndUpdate(userId, {
            $push: { workspaces: workspace._id }
        });

        return res.status(StatusCodes.CREATED).json({
            message: 'Workspace created successfully',
            workspace,
        });
    } catch (error: any) {
        console.error("Create Workspace Error:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Error creating workspace',
            error: error.message,
        });
    }
};

/**
 * Get all workspaces for the authenticated user.
 */
export const getMyWorkspaces = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'User not authenticated' });
        }

        // 1. 直接查 Workspace 表
        // 逻辑：只要 members 数组里有任何一个人的 userId 等于当前用户 ID
        const workspaces = await Workspace.find({
            "members.userId": new mongoose.Types.ObjectId(userId)
        }).sort({ createdAt: -1 });

        return res.status(StatusCodes.OK).json({ workspaces });
    } catch (error: any) {
        console.error("Get Workspaces Error:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Error fetching workspaces',
            error: error.message,
        });
    }
};