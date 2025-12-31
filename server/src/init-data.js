import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Role from './models/Role.js';
import Menu from './models/Menu.js';

dotenv.config();

async function initData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB 连接成功');

    // 清空现有数据
    await User.deleteMany({});
    await Role.deleteMany({});
    await Menu.deleteMany({});
    console.log('🗑️  清空现有数据');

    // 创建角色
    const superAdminRole = await Role.create({
      roleName: '超级管理员',
      roleCode: 'super_admin',
      description: '拥有所有权限',
      sortOrder: 1
    });

    const adminRole = await Role.create({
      roleName: '管理员',
      roleCode: 'admin',
      description: '系统管理员',
      sortOrder: 2
    });

    const userRole = await Role.create({
      roleName: '普通用户',
      roleCode: 'user',
      description: '普通用户',
      sortOrder: 3
    });

    console.log('✅ 创建角色成功');

    // 创建菜单
    const dashboardMenu = await Menu.create({
      menuName: '首页',
      menuCode: 'dashboard',
      menuType: 2,
      path: '/',
      icon: 'HomeOutlined',
      sortOrder: 1
    });

    const systemMenu = await Menu.create({
      menuName: '系统管理',
      menuCode: 'system',
      menuType: 1,
      path: '/system',
      icon: 'SettingOutlined',
      sortOrder: 2
    });

    const userMenu = await Menu.create({
      parentId: systemMenu._id,
      menuName: '用户管理',
      menuCode: 'system_user',
      menuType: 2,
      path: '/system/user',
      component: 'pages/system/user',
      icon: 'UserOutlined',
      sortOrder: 1
    });

    const roleMenu = await Menu.create({
      parentId: systemMenu._id,
      menuName: '角色管理',
      menuCode: 'system_role',
      menuType: 2,
      path: '/system/role',
      component: 'pages/system/role',
      icon: 'TeamOutlined',
      sortOrder: 2
    });

    const menuMenu = await Menu.create({
      parentId: systemMenu._id,
      menuName: '菜单管理',
      menuCode: 'system_menu',
      menuType: 2,
      path: '/system/menu',
      component: 'pages/system/menu',
      icon: 'MenuOutlined',
      sortOrder: 3
    });

    const authMenu = await Menu.create({
      parentId: systemMenu._id,
      menuName: '权限管理',
      menuCode: 'system_auth',
      menuType: 2,
      path: '/system/auth',
      component: 'pages/system/auth',
      icon: 'SafetyOutlined',
      sortOrder: 4
    });

    console.log('✅ 创建菜单成功');

    // 给超级管理员角色分配所有菜单
    const allMenus = await Menu.find();
    superAdminRole.menus = allMenus.map(m => m._id);
    await superAdminRole.save();

    // 创建管理员用户
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      realName: '系统管理员',
      email: 'admin@example.com',
      password: hashedPassword,
      roles: [superAdminRole._id]
    });

    console.log('✅ 创建管理员用户成功');
    console.log('\n📝 登录信息:');
    console.log('   邮箱: admin@example.com');
    console.log('   密码: admin123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ 初始化失败:', error);
    process.exit(1);
  }
}

initData();
