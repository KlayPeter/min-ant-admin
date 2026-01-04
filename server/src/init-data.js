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

    // 创建菜单
    const dashboardMenu = await Menu.create({
      name: '首页',
      type: 2,
      path: '/',
      component: 'pages/dashboard',
      icon: 'HomeOutlined',
      sortOrder: 1
    });

    const systemMenu = await Menu.create({
      name: '系统管理',
      type: 1,
      path: '/system',
      icon: 'SettingOutlined',
      sortOrder: 2
    });

    const userMenu = await Menu.create({
      parentId: systemMenu._id,
      name: '用户管理',
      type: 2,
      path: '/system/user',
      component: 'pages/system/user',
      icon: 'UserOutlined',
      sortOrder: 1
    });

    const roleMenu = await Menu.create({
      parentId: systemMenu._id,
      name: '角色管理',
      type: 2,
      path: '/system/role',
      component: 'pages/system/role',
      icon: 'TeamOutlined',
      sortOrder: 2
    });

    const menuMenu = await Menu.create({
      parentId: systemMenu._id,
      name: '菜单管理',
      type: 2,
      path: '/system/menu',
      component: 'pages/system/menu',
      icon: 'MenuOutlined',
      sortOrder: 3
    });

    const authMenu = await Menu.create({
      parentId: systemMenu._id,
      name: '权限管理',
      type: 2,
      path: '/system/auth',
      component: 'pages/system/auth',
      icon: 'SafetyOutlined',
      sortOrder: 4
    });

    console.log('✅ 创建菜单成功');

    // 创建角色
    const allMenus = [dashboardMenu._id, systemMenu._id, userMenu._id, roleMenu._id, menuMenu._id, authMenu._id];
    
    const superAdminRole = await Role.create({
      roleCode: 'super_admin',
      roleName: '超级管理员',
      description: '拥有所有权限',
      menus: allMenus
    });

    const adminRole = await Role.create({
      roleCode: 'admin',
      roleName: '管理员',
      description: '系统管理员',
      menus: [dashboardMenu._id, systemMenu._id, userMenu._id, roleMenu._id]
    });

    await Role.create({
      roleCode: 'user',
      roleName: '普通用户',
      description: '普通用户',
      menus: [dashboardMenu._id]
    });

    console.log('✅ 创建角色成功');

    // 创建管理员用户
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      username: 'admin',
      password: hashedPassword,
      nickname: '系统管理员',
      roles: [superAdminRole._id]
    });

    // 创建普通管理员
    await User.create({
      username: 'manager',
      password: hashedPassword,
      nickname: '管理员',
      roles: [adminRole._id]
    });

    console.log('✅ 创建用户成功');
    console.log('\n📝 登录信息:');
    console.log('   超级管理员 - 用户名: admin  密码: admin123');
    console.log('   管理员     - 用户名: manager 密码: admin123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ 初始化失败:', error);
    process.exit(1);
  }
}

initData();
