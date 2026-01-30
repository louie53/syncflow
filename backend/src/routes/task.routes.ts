import { Router } from 'express';
import { createTask, deleteTask, getMyTasks, updateTask } from '../controllers/task.controller';

// 👇 1. 修正导入方式：用花括号 { } 导入准确的名字
import { authMiddleware } from '../middlewares/auth.middleware';

// 👇 2. 引入验证中间件 (Zod)
import validateResource from '../middlewares/validateResource';

// 👇 3. 引入验证规则 (Schema)
import { createTaskSchema, getTaskSchema, updateTaskSchema } from '../schemas/task.schema';

const router = Router();

// 🔒 全局鉴权
// 告诉 Express：这个文件里的所有路由，都要先过 authMiddleware 这一关
router.use(authMiddleware);

// --- Routes ---

// 1. 获取列表 (GET /)
router.get('/', getMyTasks);

// 2. 创建任务 (POST /) 
// 流程：鉴权(顶层已做) -> 数据验证(这里做) -> Controller
router.post('/', validateResource(createTaskSchema), createTask);

// 3. 修改任务 (PUT /:id)
router.put('/:id', validateResource(updateTaskSchema), updateTask);

// ✨ 4. 修改任务 (PATCH - 这里的 PATCH 也必须加上验证！)
// 使用同样的 updateTaskSchema 即可
router.patch('/:id', validateResource(updateTaskSchema), updateTask);

// 5. 删除任务
router.delete('/:id', validateResource(getTaskSchema), deleteTask);

export default router;