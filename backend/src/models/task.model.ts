import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
    title: string;
    description?: string;
    status: "TODO" | "IN_PROGRESS" | "DONE";

    // 👇 核心改动：任务属于工作区
    workspaceId: mongoose.Types.ObjectId;

    // 👇 新增：任务是谁创建的？（方便追溯）
    createdBy: mongoose.Types.ObjectId;

    // 👇 新增：任务指派给谁做？（可能是别人）
    assigneeId?: mongoose.Types.ObjectId;

    createdAt: Date;
    updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String },
        status: {
            type: String,
            enum: ["TODO", "IN_PROGRESS", "DONE"],
            default: "TODO",
        },

        // 必须属于一个 Workspace
        workspaceId: {
            type: Schema.Types.ObjectId,
            ref: "Workspace",
            required: true
        },

        // 记录谁创建了这个任务
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // 任务指派给谁 (可选)
        assigneeId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
    },
    { timestamps: true }
);

export const Task = mongoose.model<ITask>("Task", taskSchema);