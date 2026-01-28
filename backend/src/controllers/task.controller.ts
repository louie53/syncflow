import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Task } from '../models/task.model'; // 👈 关键：直接引用 Model，跳过旧 Service

// 1. 创建任务 (适配工作区)
export const createTask = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        // 前端发过来的时候，除了 title，还必须带上 workspaceId
        const { title, description, status, workspaceId } = req.body;

        if (!workspaceId) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Workspace ID is required' });
        }

        // 直接跟数据库对话
        const task = await Task.create({
            title,
            description,
            status: status || 'TODO',
            workspaceId: new mongoose.Types.ObjectId(workspaceId as string), // 关联工作区
            createdBy: new mongoose.Types.ObjectId(userId), // 关联创建者
            // assigneeId: new mongoose.Types.ObjectId(userId) // 可选：默认分派给自己
        });

        return res.status(StatusCodes.CREATED).json({ task });
    } catch (e: any) {
        console.error("Create Task Error:", e);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
};

// 2. 获取任务列表 (适配工作区)
export const getMyTasks = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        const { workspaceId } = req.query; // 支持前端筛选 ?workspaceId=xxx

        const query: any = {};

        // 逻辑 A: 如果前端传了 workspaceId，就只查那个工作区的任务
        if (workspaceId) {
            query.workspaceId = new mongoose.Types.ObjectId(workspaceId as string);
        }
        // 逻辑 B: 如果没传，就查所有"跟我有关"的任务
        else {
            query.$or = [
                { createdBy: new mongoose.Types.ObjectId(userId) },
                { assigneeId: new mongoose.Types.ObjectId(userId) }
            ];
        }

        // populate 让你能看到任务属于哪个工作区的名字
        const tasks = await Task.find(query)
            .populate('workspaceId', 'name')
            .sort({ createdAt: -1 });

        return res.status(StatusCodes.OK).json({ tasks });
    } catch (e: any) {
        console.error("Get Tasks Error:", e);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
};

// 3. 修改任务
export const updateTask = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const update = req.body;

        const updatedTask = await Task.findByIdAndUpdate(
            new mongoose.Types.ObjectId(id),
            update,
            { new: true }
        );

        if (!updatedTask) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Task not found' });
        }

        return res.status(StatusCodes.OK).json({ task: updatedTask });
    } catch (e: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
};

// 4. 删除任务
export const deleteTask = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const result = await Task.deleteOne({
            _id: new mongoose.Types.ObjectId(id),
            createdBy: new mongoose.Types.ObjectId(userId) // 安全起见：只有创建者能删
        });

        if (result.deletedCount === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Task not found or permission denied' });
        }

        return res.status(StatusCodes.OK).json({ message: 'Task deleted' });
    } catch (e: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
};