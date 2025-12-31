import express from 'express';
import Role from '../models/Role.js';
import User from '../models/User.js';

const router = express.Router();

// 获取角色列表（分页）
router.post('/getRoleAdminList', async (req, res) => {
  try {
    const { page = 1, rows = 10 } = req.body;
    
    const total = await Role.countDocuments();
    const roles = await Role.find()
      .sort({ sortOrder: 1 })
      .skip((page - 1) * rows)
      .limit(rows);
    
    const data = roles.map(role => ({
      id: role._id,
      roleName: role.roleName,
      roleCode: role.roleCode,
      description: role.description,
      status: role.status,
      sortOrder: role.sortOrder,
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
  try {
    const roles = await Role.find().sort({ sortOrder: 1 });
    const data = roles.map(role => ({
      id: role._id,
      roleName: role.roleName,
      roleCode: role.roleCode,
      description: role.description,
      status: role.status,
      sortOrder: role.sortOrder,
      createdAt: role.createdAt
    }));
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 添加角色
router.post('/addRole', async (req, res) => {
  try {
    const { roleName, roleCode, description, sortOrder } = req.body;
    const role = new Role({ roleName, roleCode, description, sortOrder });
    await role.save();
    res.json({ success: true, data: { roleId: role._id }, message: '添加成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 编辑角色
router.post('/editRole', async (req, res) => {
  try {
    const { id, roleName, roleCode, description, sortOrder } = req.body;
    await Role.findByIdAndUpdate(id, { roleName, roleCode, description, sortOrder });
    res.json({ success: true, data: {}, message: '更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 删除角色
router.post('/deleteRole', async (req, res) => {
  try {
    const { id } = req.body;
    await Role.findByIdAndDelete(id);
    res.json({ success: true, data: {}, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取角色用户列表
router.post('/getRoleUserList', async (req, res) => {
  try {
    const { roleId } = req.body;
    
    const includeUsers = await User.find({ roles: roleId })
      .select('_id realName email status');
    
    const excludeUsers = await User.find({ roles: { $ne: roleId } })
      .select('_id realName email status');

    res.json({
      success: true,
      data: {
        includeList: includeUsers.map(u => ({
          userId: u._id,
          realName: u.realName,
          email: u.email,
          status: u.status
        })),
        excludeList: excludeUsers.map(u => ({
          userId: u._id,
          realName: u.realName,
          email: u.email,
          status: u.status
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 更新角色用户
router.post('/UpdateRoleUserList', async (req, res) => {
  try {
    const { roleId, userIds } = req.body;
    const userIdArray = userIds ? userIds.split(',') : [];
    
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
