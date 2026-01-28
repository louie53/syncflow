import mongoose from 'mongoose';
import { Task as TaskModel } from '../models/task.model';
import { CreateTaskInput, UpdateTaskInput } from '../schemas/task.schema';

// 👨‍🍳 厨师 1：创建任务 (配方升级：加了 workspaceId，user 改名 createdBy)
export const createTaskService = async (
    input: CreateTaskInput & { workspaceId: string }, // 👈 强制要求带上 workspaceId
    userId: string
) => {
    return TaskModel.create({
        ...input,
        status: 'TODO',
        createdBy: new mongoose.Types.ObjectId(userId), // ✅ 修正：user -> createdBy
        workspaceId: new mongoose.Types.ObjectId(input.workspaceId) // ✅ 新增：关联工作区
    });
};

// 👨‍🍳 厨师 2：查找任务 (逻辑升级)
export const findUserTasksService = async (userId: string) => {
    const objectId = new mongoose.Types.ObjectId(userId);

    // 查找：我是创建者 OR 我是执行者
    return TaskModel.find({
        $or: [
            { createdBy: objectId }, // ✅ 修正：user -> createdBy
            { assigneeId: objectId }
        ]
    }).sort({ createdAt: -1 });
};

// 👨‍🍳 厨师 3：修改任务
export const findAndUpdateTaskService = async (
    query: { _id: string; userId: string }, // 注意：这里传进来的参数名我改清晰了一点
    update: UpdateTaskInput,
    options: { new: true }
) => {
    return TaskModel.findOneAndUpdate(
        {
            _id: new mongoose.Types.ObjectId(query._id),
            // 只有创建者能改 (或者你可以放宽限制)
            createdBy: new mongoose.Types.ObjectId(query.userId) // ✅ 修正
        },
        update,
        options
    );
};

// 👨‍🍳 厨师 4：删除任务
export const deleteTaskService = async (query: { _id: string; userId: string }) => {
    return TaskModel.deleteOne({
        _id: new mongoose.Types.ObjectId(query._id),
        createdBy: new mongoose.Types.ObjectId(query.userId) // ✅ 修正
    });
};