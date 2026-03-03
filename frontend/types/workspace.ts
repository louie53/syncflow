// frontend/types/workspace.ts

export type WorkspaceRole = 'OWNER' | 'ADMIN' | 'MEMBER';

export interface WorkspaceMember {
    userId: string;
    role: WorkspaceRole;
    joinedAt: string;
}

export interface Workspace {
    _id: string;
    name: string;
    ownerId: string;
    members: WorkspaceMember[];
    createdAt: string;
}
