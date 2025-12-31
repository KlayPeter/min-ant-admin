import express from 'express';
import Role from '../models/Role.js';
import User from '../models/User.js';
import Menu from '../models/Menu.js';

const router = express.Router();

// 获取角色菜单权限树
router.post('/getMenuTreeWithRole', async (req, res) => {
  // #swagger.tags = ['权限管理']
  // #swagger.summary = '获取角色菜单权限树'
  /* #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["roleId"],
          properties: {
            roleId: { type: "string", description: "角色ID", example: "507f1f77bcf86cd799439011" }
          }
        }
      }
    }
  } */
  try {
    const { roleId } = req.body;
    const role = await Role.findById(roleId).populate('menus');
    const allMenus = await Menu.find({ status: 1 }).sort({ sortOrder: 1 });
    
    const roleMenuIds = role?.menus.map(m => m._id.toString()) || [];
    
    const data = allMenus.map(menu => ({
      id: menu._id,
      parentId: menu.parentId,
      menuName: menu.menuName,
      src: menu.path,
      seq: menu.sortOrder,
      ck: roleMenuIds.includes(menu._id.toString())
    }));
    
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取用户菜单权限树
router.post('/getMenuTreeWithUser', async (req, res) => {
  // #swagger.tags = ['权限管理']
  // #swagger.summary = '获取用户菜单权限树'
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
    const user = await User.findById(userId).populate({
      path: 'roles',
      populate: { path: 'menus' }
    });
    
    const allMenus = await Menu.find({ status: 1 }).sort({ sortOrder: 1 });
    
    const userMenuIds = new Set();
    user?.roles.forEach(role => {
      role.menus?.forEach(menu => {
        userMenuIds.add(menu._id.toString());
      });
    });
    
    const data = allMenus.map(menu => ({
      id: menu._id,
      parentId: menu.parentId,
      menuName: menu.menuName,
      src: menu.path,
      seq: menu.sortOrder,
      ck: userMenuIds.has(menu._id.toString())
    }));
    
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 保存角色菜单权限
router.post('/saveRoleMenu', async (req, res) => {
  // #swagger.tags = ['权限管理']
  // #swagger.summary = '保存角色菜单权限'
  /* #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["roleId", "menuIds"],
          properties: {
            roleId: { type: "string", description: "角色ID", example: "507f1f77bcf86cd799439011" },
            menuIds: { type: "string", description: "菜单ID列表，逗号分隔", example: "id1,id2,id3" }
          }
        }
      }
    }
  } */
  try {
    const { roleId, menuIds } = req.body;
    const menuIdArray = menuIds ? menuIds.split(',') : [];
    
    await Role.findByIdAndUpdate(roleId, { menus: menuIdArray });
    res.json({ success: true, data: {}, message: '保存成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
