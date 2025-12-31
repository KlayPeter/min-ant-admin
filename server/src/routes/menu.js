import express from 'express';
import Menu from '../models/Menu.js';

const router = express.Router();

// 获取菜单树
router.post('/getMenuTree', async (req, res) => {
  // #swagger.tags = ['菜单管理']
  // #swagger.summary = '获取菜单树'
  try {
    const menus = await Menu.find().sort({ sortOrder: 1 });
    const data = menus.map(menu => ({
      id: menu._id,
      parentId: menu.parentId,
      menuName: menu.menuName,
      menuCode: menu.menuCode,
      menuType: menu.menuType,
      path: menu.path,
      component: menu.component,
      icon: menu.icon,
      sortOrder: menu.sortOrder,
      visible: menu.visible,
      status: menu.status,
      permissionCode: menu.permissionCode
    }));
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 添加菜单
router.post('/addMenuTree', async (req, res) => {
  // #swagger.tags = ['菜单管理']
  // #swagger.summary = '添加菜单'
  /* #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["menuName", "menuCode", "menuType"],
          properties: {
            parentId: { type: "string", description: "父菜单ID", example: null },
            menuName: { type: "string", description: "菜单名称", example: "系统管理" },
            menuCode: { type: "string", description: "菜单编码", example: "system" },
            menuType: { type: "number", description: "菜单类型 1:目录 2:菜单 3:按钮", example: 1, enum: [1, 2, 3] },
            path: { type: "string", description: "路由路径", example: "/system" },
            component: { type: "string", description: "组件路径", example: "Layout" },
            icon: { type: "string", description: "图标", example: "SettingOutlined" },
            sortOrder: { type: "number", description: "排序", example: 1 },
            visible: { type: "number", description: "是否可见 1:是 0:否", example: 1 },
            status: { type: "number", description: "状态 1:启用 0:禁用", example: 1 },
            permissionCode: { type: "string", description: "权限编码", example: "system:view" }
          }
        }
      }
    }
  } */
  try {
    const menu = new Menu(req.body);
    await menu.save();
    res.json({ success: true, data: { menuId: menu._id }, message: '添加成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 编辑菜单
router.post('/editMenuTree', async (req, res) => {
  // #swagger.tags = ['菜单管理']
  // #swagger.summary = '编辑菜单'
  /* #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string", description: "菜单ID", example: "507f1f77bcf86cd799439011" },
            parentId: { type: "string", description: "父菜单ID" },
            menuName: { type: "string", description: "菜单名称" },
            menuCode: { type: "string", description: "菜单编码" },
            menuType: { type: "number", description: "菜单类型" },
            path: { type: "string", description: "路由路径" },
            component: { type: "string", description: "组件路径" },
            icon: { type: "string", description: "图标" },
            sortOrder: { type: "number", description: "排序" },
            visible: { type: "number", description: "是否可见" },
            status: { type: "number", description: "状态" }
          }
        }
      }
    }
  } */
  try {
    const { id, ...updateData } = req.body;
    await Menu.findByIdAndUpdate(id, updateData);
    res.json({ success: true, data: {}, message: '更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 删除菜单
router.post('/deleteMenuById', async (req, res) => {
  // #swagger.tags = ['菜单管理']
  // #swagger.summary = '删除菜单'
  /* #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string", description: "菜单ID", example: "507f1f77bcf86cd799439011" }
          }
        }
      }
    }
  } */
  try {
    const { id } = req.body;
    await Menu.findByIdAndDelete(id);
    res.json({ success: true, data: {}, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
