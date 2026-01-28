import bcrypt from 'bcryptjs';
import mongoose, { Document, Schema } from 'mongoose';

// 1. 定义接口
export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  //这是系统级的角色（比如全站管理员），跟工作区内的角色不冲突
  role: 'admin' | 'editor' | 'member' | 'guest';
  refreshToken?: string;

  // 👇 新增：这里就是用户的“钥匙串”，存着他加入的所有工作区 ID
  workspaces: mongoose.Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;

  // 自定义方法
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'editor', 'member', 'guest'],
      default: 'member',
    },
    refreshToken: {
      type: String,
      select: false,
    },
    // 👇 新增：数据库字段定义
    workspaces: [
      { type: Schema.Types.ObjectId, ref: 'Workspace' }
    ]
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// 2. 钩子函数 (保留你的原逻辑)
userSchema.pre('save', async function (next) {
  const user = this as unknown as IUser;
  // 如果密码没变，就别重新加密，否则密码就错了
  if (!user.isModified('password')) return;

  const salt = await bcrypt.genSalt(12);
  user.password = await bcrypt.hash(user.password, salt);
  // next(); // Mongoose 6+ 这里的 next 是可选的，不写也没事，但写上也无妨
});

// 3. 挂载方法 (保留你的原逻辑)
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  const user = this as unknown as IUser;
  return await bcrypt.compare(candidatePassword, user.password);
};

export const User = mongoose.model<IUser>('User', userSchema);