import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes'; // 刚刚装的工具
import { User } from '../models/user.model'; // 引入刚才画的“图纸”

/**
 * 注册接口逻辑
 * Path: POST /api/auth/register
 */
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        // 1. 接单：从请求体 (Body) 获取数据
        const { email, password, firstName, lastName } = req.body;

        // 2. 检查：这是不是回头客？(邮箱查重)
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            // 如果找到了，直接拒绝。409 Conflict (冲突)
            res.status(StatusCodes.CONFLICT).json({ message: 'User already exists' });
            return;
        }

        // 3. 烹饪：创建新用户
        // ⚠️ 注意：今天先暂时明文存密码，明天 (Day 03) 我们会专门给这里加“加密层”！
        const user = await User.create({
            email,
            password,
            firstName,
            lastName,
        });

        // 4. 上菜：返回成功信息
        // 201 Created (已创建)
        res.status(StatusCodes.CREATED).json({
            message: 'User registered successfully!',
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                // 注意：这里我们没有返回 password，保护隐私
            },
        });

    } catch (error) {
        // 5. 兜底：万一数据库挂了，或者代码报错了
        console.error('Register Error:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};