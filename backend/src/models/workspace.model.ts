import mongoose, { Document, Schema } from 'mongoose';

export interface IWorkspace extends Document {
    name: string;
    ownerId: mongoose.Types.ObjectId;
    members: mongoose.Types.ObjectId[]; // References WorkspaceMember
    createdAt: Date;
    updatedAt: Date;
}

const workspaceSchema = new Schema<IWorkspace>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        members: [
            {
                type: Schema.Types.ObjectId,
                ref: 'WorkspaceMember',
            },
        ],
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const Workspace = mongoose.model<IWorkspace>('Workspace', workspaceSchema);
