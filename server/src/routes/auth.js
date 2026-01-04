import express from 'express';
import Role from '../models/Role.js';
import User from '../models/User.js';
import Menu from '../models/Menu.js';

const router = express.Router();

// 获取角色菜单权限树
router.post('/getRoleMenuTree', async (req, res) => {
  // #swagger.tags = ['权限管理']
  // #swagger.summary = '获取角色菜单权限树'
  try {
    const { roleId } = req.body;
    const role = await Role.findById(roleId);
    const allMenus = await Menu.find({ status: 1 }).sort({ sortOrder: 1 });
    
    const roleMenuIds = role?.menus.map(m => m.toString()) || [];
    
    const data = allMenus.map(menu => ({
      id: menu._id,
      parentId: menu.parentId,
      name: menu.name,
      type: menu.type,
      checked: roleMenuIds.includes(menu._id.toString())
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
  try {
    const { roleId, menuIds } = req.body;
    const menuIdArray = Array.isArray(menuIds) ? menuIds : (menuIds ? menuIds.split(',') : []);
    
    await Role.findByIdAndUpdate(roleId, { menus: menuIdArray });
    res.json({ success: true, data: {}, message: '保存成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取用户菜单权限树（用户额外权限）
router.post('/getUserMenuTree', async (req, res) => {
  // #swagger.tags = ['权限管理']
  // #swagger.summary = '获取用户菜单权限树'
  try {
    const { userId } = req.body;
    const user = await User.findById(userId).populate('roles');
    const allMenus = await Menu.find({ status: 1 }).sort({ sortOrder: 1 });
    
    // 用户通过角色获得的菜单
    const roleMenuIds = new Set();
    user?.roles.forEach(role => {
      role.menus?.forEach(menuId => {
        roleMenuIds.add(menuId.toString());
      });
    });
    
    // 用户额外的菜单权限
    const userMenuIds = user?.menus.map(m => m.toString()) || [];
    
    const data = allMenus.map(menu => ({
      id: menu._id,
      parentId: menu.parentId,
      name: menu.name,
      type: menu.type,
      fromRole: roleMenuIds.has(menu._id.toString()), // 来自角色
      checked: userMenuIds.includes(menu._id.toString()) // 用户额外授权
    }));
    
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 保存用户菜单权限（额外权限）
router.post('/saveUserMenu', async (req, res) => {
  // #swagger.tags = ['权限管理']
  // #swagger.summary = '保存用户菜单权限'
  try {
    const { userId, menuIds } = req.body;
    const menuIdArray = Array.isArray(menuIds) ? menuIds : (menuIds ? menuIds.split(',') : []);
    
    await User.findByIdAndUpdate(userId, { menus: menuIdArray });
    res.json({ success: true, data: {}, message: '保存成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 构建菜单树
function buildMenuTree(menus) {
  const menuMap = new Map();
  const roots = [];

  // 先创建所有节点的映射
  menus.forEach(menu => {
    menuMap.set(menu.id, { ...menu, children: [] });
  });

  // 构建树形结构
  menus.forEach(menu => {
    const node = menuMap.get(menu.id);
    if (!menu.parentId || menu.parentId === null) {
      roots.push(node);
    } else {
      const parent = menuMap.get(menu.parentId);
      if (parent) {
        parent.children.push(node);
      } else {
        // 如果找不到父节点，放到根节点
        roots.push(node);
      }
    }
  });

  return roots;
}

// 获取用户最终菜单（登录后调用）
router.post('/getUserFinalMenus', async (req, res) => {
  // #swagger.tags = ['权限管理']
  // #swagger.summary = '获取用户最终菜单'
  try {
    const { userId } = req.body;
    const user = await User.findById(userId).populate({
      path: 'roles',
      populate: { path: 'menus' }
    }).populate('menus');
    
    if (!user) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }
    
    // 合并角色菜单 + 用户额外菜单
    const menuIds = new Set();
    
    // 1. 从角色获取菜单
    user.roles.forEach(role => {
      role.menus?.forEach(menu => {
        if (menu.status === 1) {
          menuIds.add(menu._id.toString());
        }
      });
    });
    
    // 2. 用户额外菜单
    user.menus?.forEach(menu => {
      if (menu.status === 1) {
        menuIds.add(menu._id.toString());
      }
    });
    
    // 3. 查询完整菜单信息
    const menus = await Menu.find({ 
      _id: { $in: Array.from(menuIds) },
      status: 1,
      visible: 1
    }).sort({ sortOrder: 1 });
    
    // 4. 转换为平面数组
    const flatMenus = menus.map(menu => ({
      id: menu._id.toString(),
      parentId: menu.parentId ? menu.parentId.toString() : null,
      name: menu.name,
      path: menu.path,
      component: menu.component,
      icon: menu.icon,
      type: menu.type,
      sortOrder: menu.sortOrder
    }));
    
    // 5. 构建树形结构
    const menuTree = buildMenuTree(flatMenus);
    
    res.json({ success: true, data: menuTree });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
