import mongoose, { Document, Schema } from 'mongoose';

export interface IWorkspaceMember extends Document {
    userId: mongoose.Types.ObjectId;
    workspaceId: mongoose.Types.ObjectId;
    role: 'admin' | 'editor' | 'member' | 'guest';
    createdAt: Date;
    updatedAt: Date;
}

const workspaceMemberSchema = new Schema<IWorkspaceMember>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        workspaceId: {
            type: Schema.Types.ObjectId,
            ref: 'Workspace',
            required: true,
        },
        role: {
            type: String,
            enum: ['admin', 'editor', 'member', 'guest'],
            default: 'member',
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Ensure a user can only have one membership per workspace
workspaceMemberSchema.index({ userId: 1, workspaceId: 1 }, { unique: true });

export const WorkspaceMember = mongoose.model<IWorkspaceMember>(
    'WorkspaceMember',
    workspaceMemberSchema
);
