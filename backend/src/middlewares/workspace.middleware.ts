import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { WorkspaceMember } from '../models/workspaceMember.model';
import { AuthRequest } from './auth.middleware';

/**
 * Middleware to check if the user has a specific role in a workspace.
 * @param allowedRoles Array of roles that are permitted to access the resource.
 */
export const checkRole = (allowedRoles: string[]) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId;
            // Get workspaceId from params, headers, or body
            const workspaceId = req.params.workspaceId || req.headers['x-workspace-id'] || req.body.workspaceId;

            if (!userId) {
                return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'User not authenticated' });
            }

            if (!workspaceId) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Workspace ID is required' });
            }

            // Find the member record for this user in this workspace
            const membership = await WorkspaceMember.findOne({
                userId,
                workspaceId,
            });

            if (!membership) {
                return res.status(StatusCodes.FORBIDDEN).json({
                    message: 'You are not a member of this workspace',
                });
            }

            // Check if the user's role is in the allowedRoles list
            if (!allowedRoles.includes(membership.role)) {
                return res.status(StatusCodes.FORBIDDEN).json({
                    message: `Permission denied. Required roles: ${allowedRoles.join(', ')}`,
                });
            }

            // Optionally attach the role to the request for further use
            (req as any).workspaceRole = membership.role;

            next();
        } catch (error: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Error checking permissions',
                error: error.message,
            });
        }
    };
};
