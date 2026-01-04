import express from 'express';
import Role from '../models/Role.js';
import User from '../models/User.js';

const router = express.Router();

// 获取角色列表（分页）
router.post('/getRoleList', async (req, res) => {
  // #swagger.tags = ['角色管理']
  // #swagger.summary = '获取角色列表（分页）'
  try {
    const { page = 1, rows = 10 } = req.body;
    
    const total = await Role.countDocuments();
    const roles = await Role.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * rows)
      .limit(rows);
    
    const data = roles.map(role => ({
      id: role._id,
      roleCode: role.roleCode,
      roleName: role.roleName,
      description: role.description,
      status: role.status,
      createdAt: role.createdAt
    }));
    
    res.json({ 
      success: true, 
      data: { rows: data, total }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取所有角色列表（不分页，用于下拉选择）
router.post('/getAllRoles', async (req, res) => {
  // #swagger.tags = ['角色管理']
  // #swagger.summary = '获取所有角色（不分页）'
  try {
    const roles = await Role.find({ status: 1 }).sort({ createdAt: -1 });
    const data = roles.map(role => ({
      id: role._id,
      roleCode: role.roleCode,
      roleName: role.roleName
    }));
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 添加角色
router.post('/addRole', async (req, res) => {
  // #swagger.tags = ['角色管理']
  // #swagger.summary = '添加角色'
  try {
    const { roleCode, roleName, description } = req.body;
    const role = new Role({ roleCode, roleName, description });
    await role.save();
    res.json({ success: true, data: { id: role._id }, message: '添加成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 编辑角色
router.post('/editRole', async (req, res) => {
  // #swagger.tags = ['角色管理']
  // #swagger.summary = '编辑角色'
  try {
    const { id, roleCode, roleName, description } = req.body;
    await Role.findByIdAndUpdate(id, { roleCode, roleName, description });
    res.json({ success: true, data: {}, message: '更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 删除角色
router.post('/deleteRole', async (req, res) => {
  // #swagger.tags = ['角色管理']
  // #swagger.summary = '删除角色'
  try {
    const { id } = req.body;
    // 检查是否有用户使用该角色
    const hasUsers = await User.findOne({ roles: id });
    if (hasUsers) {
      return res.json({ success: false, message: '该角色下有用户，无法删除' });
    }
    await Role.findByIdAndDelete(id);
    res.json({ success: true, data: {}, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 修改角色状态
router.post('/changeRoleStatus', async (req, res) => {
  // #swagger.tags = ['角色管理']
  // #swagger.summary = '修改角色状态'
  try {
    const { id, status } = req.body;
    await Role.findByIdAndUpdate(id, { status });
    res.json({ success: true, data: {}, message: '状态修改成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取角色用户列表
router.post('/getRoleUserList', async (req, res) => {
  // #swagger.tags = ['角色管理']
  // #swagger.summary = '获取角色用户列表'
  try {
    const { roleId } = req.body;
    
    const includeUsers = await User.find({ roles: roleId })
      .select('_id username nickname status');
    
    const excludeUsers = await User.find({ roles: { $ne: roleId } })
      .select('_id username nickname status');

    res.json({
      success: true,
      data: {
        includeList: includeUsers.map(u => ({
          userId: u._id,
          username: u.username,
          nickname: u.nickname,
          status: u.status
        })),
        excludeList: excludeUsers.map(u => ({
          userId: u._id,
          username: u.username,
          nickname: u.nickname,
          status: u.status
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 更新角色用户
router.post('/updateRoleUserList', async (req, res) => {
  // #swagger.tags = ['角色管理']
  // #swagger.summary = '更新角色用户'
  try {
    const { roleId, userIds } = req.body;
    const userIdArray = userIds ? userIds.split(',').filter(id => id) : [];
    
    // 移除所有用户的该角色
    await User.updateMany(
      { roles: roleId },
      { $pull: { roles: roleId } }
    );
    
    // 给指定用户添加该角色
    if (userIdArray.length > 0) {
      await User.updateMany(
        { _id: { $in: userIdArray } },
        { $addToSet: { roles: roleId } }
      );
    }

    res.json({ success: true, data: {}, message: '更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
