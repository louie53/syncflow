import mongoose, { Document, Schema } from "mongoose";

// 1. 定义“成员”的结构：包括 ID、角色、加入时间
interface IWorkspaceMember {
    userId: mongoose.Types.ObjectId;
    role: "OWNER" | "ADMIN" | "MEMBER";
    joinedAt: Date;
}

// 2. 定义“工作区”的结构
export interface IWorkspace extends Document {
    name: string;
    ownerId: mongoose.Types.ObjectId; // 创建者
    members: IWorkspaceMember[];      // 直接包含成员列表（更简单！）
    createdAt: Date;
    updatedAt: Date;
}

const workspaceSchema = new Schema<IWorkspace>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        // 👇 关键区别在这里：我们直接把成员存在里面
        members: [
            {
                userId: { type: Schema.Types.ObjectId, ref: "User" },
                role: {
                    type: String,
                    enum: ["OWNER", "ADMIN", "MEMBER"],
                    default: "MEMBER"
                },
                joinedAt: { type: Date, default: Date.now }
            }
        ]
    },
    { timestamps: true }
);

export const Workspace = mongoose.model<IWorkspace>("Workspace", workspaceSchema);