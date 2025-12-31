import express from 'express';
import Menu from '../models/Menu.js';

const router = express.Router();

// 获取菜单树
router.post('/getMenuTree', async (req, res) => {
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
  try {
    const { id } = req.body;
    await Menu.findByIdAndDelete(id);
    res.json({ success: true, data: {}, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
