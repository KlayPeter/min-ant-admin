import express from 'express';
import Menu from '../models/Menu.js';

const router = express.Router();

// 获取菜单树（全量）
router.post('/getMenuTree', async (req, res) => {
  // #swagger.tags = ['菜单管理']
  // #swagger.summary = '获取菜单树'
  try {
    const menus = await Menu.find().sort({ sortOrder: 1 });
    const data = menus.map(menu => ({
      id: menu._id,
      parentId: menu.parentId,
      name: menu.name,
      path: menu.path,
      component: menu.component,
      icon: menu.icon,
      type: menu.type,
      sortOrder: menu.sortOrder,
      visible: menu.visible,
      status: menu.status
    }));
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 添加菜单
router.post('/addMenu', async (req, res) => {
  // #swagger.tags = ['菜单管理']
  // #swagger.summary = '添加菜单'
  try {
    const menu = new Menu(req.body);
    await menu.save();
    res.json({ success: true, data: { id: menu._id }, message: '添加成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 编辑菜单
router.post('/editMenu', async (req, res) => {
  // #swagger.tags = ['菜单管理']
  // #swagger.summary = '编辑菜单'
  try {
    const { id, ...updateData } = req.body;
    await Menu.findByIdAndUpdate(id, updateData);
    res.json({ success: true, data: {}, message: '更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 删除菜单
router.post('/deleteMenu', async (req, res) => {
  // #swagger.tags = ['菜单管理']
  // #swagger.summary = '删除菜单'
  try {
    const { id } = req.body;
    // 检查是否有子菜单
    const hasChildren = await Menu.findOne({ parentId: id });
    if (hasChildren) {
      return res.json({ success: false, message: '请先删除子菜单' });
    }
    await Menu.findByIdAndDelete(id);
    res.json({ success: true, data: {}, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
