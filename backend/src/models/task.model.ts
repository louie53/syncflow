import mongoose, { Document, Schema } from "mongoose";

// 1. 纯数据接口 (用于创建/输入) - ❌ 不要在这里 extends Document
export interface ITask {
    title: string;
    description?: string;
    status: "TODO" | "IN_PROGRESS" | "DONE";
    priority: "LOW" | "MEDIUM" | "HIGH";
    workspaceId: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    assigneeId?: mongoose.Types.ObjectId;
}

// 2. 文档接口 (用于数据库返回) - ✅ 这里才 extends Document
// 这样 Task.create() 就不会被 Document 里的属性干扰了
export interface ITaskDocument extends ITask, Document {
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema = new Schema<ITaskDocument>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String },
        status: {
            type: String,
            enum: ["TODO", "IN_PROGRESS", "DONE"],
            default: "TODO",
        },
        priority: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH"],
            default: "MEDIUM",
        },
        workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        assigneeId: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

// 3. 导出 Model，泛型使用 ITaskDocument
export const Task = mongoose.model<ITaskDocument>("Task", taskSchema);