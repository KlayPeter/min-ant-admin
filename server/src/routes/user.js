import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// 获取用户列表
router.post('/getUserList', async (req, res) => {
  // #swagger.tags = ['用户管理']
  // #swagger.summary = '获取用户列表（分页）'
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
      id: user._id,
      username: user.username,
      nickname: user.nickname,
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
  try {
    const { username, password, nickname, roleIds } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: hashedPassword,
      nickname,
      roles: roleIds || []
    });

    await user.save();
    res.json({ 
      success: true, 
      data: { id: user._id },
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
  try {
    const { id, username, nickname, roleIds } = req.body;
    
    await User.findByIdAndUpdate(id, {
      username,
      nickname,
      roles: roleIds || []
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
  try {
    const { id } = req.body;
    await User.findByIdAndDelete(id);
    res.json({ success: true, data: {}, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 修改用户状态
router.post('/changeUserStatus', async (req, res) => {
  // #swagger.tags = ['用户管理']
  // #swagger.summary = '修改用户状态'
  try {
    const { id, status } = req.body;
    await User.findByIdAndUpdate(id, { status });
    res.json({ success: true, data: {}, message: '状态修改成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 重置密码
router.post('/resetPassword', async (req, res) => {
  // #swagger.tags = ['用户管理']
  // #swagger.summary = '重置密码'
  try {
    const { id, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(id, { password: hashedPassword });
    res.json({ success: true, data: {}, message: '密码重置成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
