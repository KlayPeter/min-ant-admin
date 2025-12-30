/**
 * 测试 Supabase 连接
 * 
 * 运行: npx tsx db/test-connection.ts
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://sjghekubcfmsjcogeatk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_99o_9q54MWStZPlL5XXU-Q_aHNB4QKT';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
  console.log('='.repeat(60));
  console.log('测试 Supabase 连接');
  console.log('='.repeat(60));
  console.log(`\nURL: ${SUPABASE_URL}`);
  console.log(`Key: ${SUPABASE_ANON_KEY.substring(0, 20)}...`);
  
  try {
    // 测试 1: 获取角色列表
    console.log('\n📋 测试 1: 获取角色列表');
    const { data: roles, error: rolesError } = await supabase.rpc('get_role_list');
    
    if (rolesError) {
      console.error('❌ 失败:', rolesError.message);
      console.log('\n💡 提示: 请先在 Supabase Dashboard 中执行 db/init.sql 和 db/functions.sql');
    } else {
      console.log('✅ 成功!');
      console.log('角色数量:', Array.isArray(roles) ? roles.length : 0);
      if (roles && roles.length > 0) {
        console.log('角色列表:', JSON.stringify(roles, null, 2));
      }
    }
    
    // 测试 2: 获取菜单树
    console.log('\n📋 测试 2: 获取完整菜单树');
    const { data: menus, error: menusError } = await supabase.rpc('get_all_menu_tree');
    
    if (menusError) {
      console.error('❌ 失败:', menusError.message);
    } else {
      console.log('✅ 成功!');
      console.log('菜单数量:', Array.isArray(menus) ? menus.length : 0);
      if (menus && menus.length > 0) {
        console.log('菜单树:', JSON.stringify(menus, null, 2));
      }
    }
    
    // 测试 3: 获取用户列表
    console.log('\n📋 测试 3: 获取用户列表');
    const { data: users, error: usersError } = await supabase.rpc('get_user_list', {
      page_num: 1,
      page_size: 10,
      status_param: 1
    });
    
    if (usersError) {
      console.error('❌ 失败:', usersError.message);
    } else {
      console.log('✅ 成功!');
      if (users) {
        console.log('用户总数:', users.total);
        console.log('当前页用户数:', users.rows?.length || 0);
        if (users.rows && users.rows.length > 0) {
          console.log('用户列表:', JSON.stringify(users.rows, null, 2));
        }
      }
    }
    
    // 测试 4: 查询表是否存在
    console.log('\n📋 测试 4: 检查数据库表');
    const { data: tables, error: tablesError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (tablesError) {
      console.error('❌ users 表不存在或无权限访问');
      console.log('错误:', tablesError.message);
    } else {
      console.log('✅ users 表存在且可访问');
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('测试完成！');
    console.log('='.repeat(60));
    
    if (!rolesError && !menusError) {
      console.log('\n✅ 数据库已正确初始化！');
      console.log('\n默认管理员账号:');
      console.log('  用户名: admin');
      console.log('  密码: admin123');
    } else {
      console.log('\n⚠️  数据库可能未初始化，请按照以下步骤操作:');
      console.log('1. 访问 Supabase Dashboard: https://supabase.com/dashboard');
      console.log('2. 打开 SQL Editor');
      console.log('3. 依次执行 db/init.sql 和 db/functions.sql');
      console.log('4. 重新运行此测试脚本');
    }
    
  } catch (error: any) {
    console.error('\n❌ 连接失败:', error.message);
    console.log('\n请检查:');
    console.log('1. Supabase URL 是否正确');
    console.log('2. API Key 是否正确');
    console.log('3. 网络连接是否正常');
  }
}

// 执行测试
testConnection();
