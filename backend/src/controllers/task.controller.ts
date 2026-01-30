import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Task } from '../models/task.model';

// 1. 创建任务 (适配工作区 + 优先级)
export const createTask = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        // ✨ 改动：解构时加上 priority
        const { title, description, status, priority, workspaceId } = req.body;

        if (!workspaceId) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Workspace ID is required' });
        }

        const task = await Task.create({
            title,
            description,
            status: status || 'TODO',
            priority: priority || 'MEDIUM', // ✨ 改动：如果没有传，默认 MEDIUM
            workspaceId: new mongoose.Types.ObjectId(workspaceId as string),
            createdBy: new mongoose.Types.ObjectId(userId),
            // assigneeId: new mongoose.Types.ObjectId(userId) 
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
        const { workspaceId } = req.query;

        const query: any = {};

        if (workspaceId) {
            query.workspaceId = new mongoose.Types.ObjectId(workspaceId as string);
        } else {
            query.$or = [
                { createdBy: new mongoose.Types.ObjectId(userId) },
                { assigneeId: new mongoose.Types.ObjectId(userId) }
            ];
        }

        const tasks = await Task.find(query)
            .populate('workspaceId', 'name')
            .sort({ createdAt: -1 });

        return res.status(StatusCodes.OK).json({ tasks });
    } catch (e: any) {
        console.error("Get Tasks Error:", e);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
};

// 3. 修改任务 (解决 404 的关键逻辑在这里)
export const updateTask = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const update = req.body; // 这里会包含 title, description, priority

        const updatedTask = await Task.findByIdAndUpdate(
            new mongoose.Types.ObjectId(id),
            update,
            { new: true } // 返回修改后的新数据
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
            // createdBy: new mongoose.Types.ObjectId(userId) // 如果你想只有创建者能删，就取消注释
        });

        if (result.deletedCount === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Task not found' });
        }

        return res.status(StatusCodes.OK).json({ message: 'Task deleted' });
    } catch (e: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
};