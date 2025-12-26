import mongoose from 'mongoose';

// 1. 定义 Schema (规则)
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true, // 必填
      unique: true,   // 唯一：数据库会自动检查是否重复
      trim: true,     // 自动去空格： "  bob@test.com " -> "bob@test.com"
      lowercase: true,// 自动转小写： "Bob@Test.com" -> "bob@test.com"
    },
    password: {
      type: String,
      required: true,
      select: false,  // 🔒 安全核心：查询用户时，默认【不返回】密码字段
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
  },
  {
    timestamps: true, // 自动生成 createdAt 和 updatedAt
    versionKey: false, // 去掉 MongoDB 默认的 __v 字段
  }
);

// 2. 导出 Model
// 以后我们在 Controller 里就用这个 'User' 变量来操作数据库
export const User = mongoose.model('User', userSchema);