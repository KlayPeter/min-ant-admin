import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// 获取用户列表
router.post('/getUserList', async (req, res) => {
  try {
    const { page = 1, rows = 10, status } = req.body;
    const query = status !== undefined ? { status } : {};
    
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .populate('roles', 'id roleName')
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
  try {
    const { realName, email, pwd, roleId } = req.body;
    
    const hashedPassword = await bcrypt.hash(pwd, 10);
    const user = new User({
      realName,
      email,
      password: hashedPassword,
      roles: roleId || []
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
  try {
    const { id, realName, email, roleId } = req.body;
    
    await User.findByIdAndUpdate(id, {
      realName,
      email,
      roles: roleId || []
    });

    res.json({ success: true, data: {}, message: '更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 删除用户
router.post('/deleteUser', async (req, res) => {
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
  try {
    const { userId, status } = req.body;
    await User.findByIdAndUpdate(userId, { status });
    res.json({ success: true, data: {}, message: '状态修改成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
