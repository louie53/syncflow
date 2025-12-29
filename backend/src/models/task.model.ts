// backend/src/models/task.model.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
    title: string;
    description?: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    user: mongoose.Types.ObjectId; // 👈 关键：关联到是哪个用户创建的
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        status: {
            type: String,
            enum: ['TODO', 'IN_PROGRESS', 'DONE'],
            default: 'TODO',
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User', // 关联 User 模型
            required: true,
        },
    },
    {
        timestamps: true, // 自动管理 createdAt 和 updatedAt
    }
);

// 索引优化：经常需要查询 "某个用户的所有任务"
taskSchema.index({ user: 1 });

export default mongoose.model<ITask>('Task', taskSchema);