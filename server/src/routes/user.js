import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// 获取用户列表
router.post('/getUserList', async (req, res) => {
  // #swagger.tags = ['用户管理']
  // #swagger.summary = '获取用户列表（分页）'
  /* #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            page: { type: "number", description: "页码", example: 1 },
            rows: { type: "number", description: "每页数量", example: 10 },
            status: { type: "number", description: "状态筛选 1:启用 0:禁用", example: 1 }
          }
        }
      }
    }
  } */
  /* #swagger.responses[200] = {
    description: "成功",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: {
              type: "object",
              properties: {
                rows: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      userId: { type: "string", example: "507f1f77bcf86cd799439011" },
                      realName: { type: "string", example: "张三" },
                      email: { type: "string", example: "zhangsan@example.com" },
                      avatarUrl: { type: "string", example: "https://example.com/avatar.jpg" },
                      status: { type: "number", example: 1 },
                      createdAt: { type: "string", example: "2024-01-01T00:00:00.000Z" },
                      roles: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "string", example: "507f1f77bcf86cd799439012" },
                            roleName: { type: "string", example: "管理员" }
                          }
                        }
                      }
                    }
                  }
                },
                total: { type: "number", example: 100 }
              }
            }
          }
        }
      }
    }
  } */
  try {
    const { page = 1, rows = 10, status } = req.body;
    const query = status !== undefined ? { status } : {};
    
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .populate('roles', '_id roleName')
      .skip((page - 1) * rows)
      .limit(rows)
      .sort({ createdAt: -1 });

    const data = users.map(user => ({
      userId: user._id,
      realName: user.realName,
      email: user.email,
      avatarUrl: user.avatarUrl,
      status: user.status,
      createdAt: user.createdAt,
      roles: user.roles.map(role => ({
        id: role._id,
        roleName: role.roleName
      }))
    }));

    res.json({ 
      success: true,
      data: { rows: data, total }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// 添加用户
router.post('/addUser', async (req, res) => {
  // #swagger.tags = ['用户管理']
  // #swagger.summary = '添加用户'
  /* #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["realName", "email", "pwd"],
          properties: {
            realName: { type: "string", description: "真实姓名", example: "张三" },
            email: { type: "string", description: "邮箱", example: "zhangsan@example.com" },
            pwd: { type: "string", description: "密码", example: "123456" },
            roleId: { type: "array", items: { type: "string" }, description: "角色ID数组", example: ["507f1f77bcf86cd799439012"] }
          }
        }
      }
    }
  } */
  try {
    const { realName, email, pwd, roleId, roleIds } = req.body;
    
    const hashedPassword = await bcrypt.hash(pwd, 10);
    const user = new User({
      realName,
      email,
      password: hashedPassword,
      roles: roleIds || roleId || []
    });

    await user.save();
    res.json({ 
      success: true, 
      data: { userId: user._id },
      message: '添加成功' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 编辑用户
router.post('/editUser', async (req, res) => {
  // #swagger.tags = ['用户管理']
  // #swagger.summary = '编辑用户'
  /* #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string", description: "用户ID", example: "507f1f77bcf86cd799439011" },
            realName: { type: "string", description: "真实姓名", example: "张三" },
            email: { type: "string", description: "邮箱", example: "zhangsan@example.com" },
            roleId: { type: "array", items: { type: "string" }, description: "角色ID数组", example: ["507f1f77bcf86cd799439012"] }
          }
        }
      }
    }
  } */
  try {
    const { id, userId, realName, email, roleId, roleIds } = req.body;
    const userIdToUpdate = id || userId;
    
    await User.findByIdAndUpdate(userIdToUpdate, {
      realName,
      email,
      roles: roleIds || roleId || []
    });

    res.json({ success: true, data: {}, message: '更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 删除用户
router.post('/deleteUser', async (req, res) => {
  // #swagger.tags = ['用户管理']
  // #swagger.summary = '删除用户'
  /* #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["userId"],
          properties: {
            userId: { type: "string", description: "用户ID", example: "507f1f77bcf86cd799439011" }
          }
        }
      }
    }
  } */
  try {
    const { userId } = req.body;
    await User.findByIdAndDelete(userId);
    res.json({ success: true, data: {}, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 修改用户状态
router.post('/changeUserStatus', async (req, res) => {
  // #swagger.tags = ['用户管理']
  // #swagger.summary = '修改用户状态'
  /* #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["userId", "status"],
          properties: {
            userId: { type: "string", description: "用户ID", example: "507f1f77bcf86cd799439011" },
            status: { type: "number", description: "状态 1:启用 0:禁用", example: 1, enum: [0, 1] }
          }
        }
      }
    }
  } */
  try {
    const { userId, status } = req.body;
    await User.findByIdAndUpdate(userId, { status });
    res.json({ success: true, data: {}, message: '状态修改成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
