import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();

// 登录
router.post('/login', async (req, res) => {
  // #swagger.tags = ['登录']
  // #swagger.summary = '用户登录'
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username }).populate('roles');
    
    if (!user) {
      return res.json({ success: false, message: '用户不存在' });
    }
    
    if (user.status === 0) {
      return res.json({ success: false, message: '用户已被禁用' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ success: false, message: '密码错误' });
    }
    
    // 只返回用户信息，不返回菜单
    res.json({ 
      success: true, 
      data: {
        id: user._id,
        username: user.username,
        nickname: user.nickname,
        roles: user.roles.map(r => ({ id: r._id, roleName: r.roleName }))
      },
      message: '登录成功' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
