/**
 * Supabase 数据库初始化脚本
 * 
 * 使用方法：
 * 1. 确保已安装依赖: npm install @supabase/supabase-js
 * 2. 配置环境变量或直接修改下面的配置
 * 3. 运行: npx tsx db/setup.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Supabase 配置
const SUPABASE_URL = 'https://sjghekubcfmsjcogeatk.supabase.co';
const SUPABASE_SERVICE_KEY = 'sb_publishable_99o_9q54MWStZPlL5XXU-Q_aHNB4QKT'; // 注意：这里应该使用 service_role key，不是 anon key

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function executeSqlFile(filePath: string) {
  console.log(`\n执行 SQL 文件: ${filePath}`);
  
  const sql = fs.readFileSync(filePath, 'utf-8');
  
  // 将 SQL 分割成多个语句（简单分割，可能需要更复杂的解析）
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));
  
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    if (!statement) continue;
    
    try {
      console.log(`执行语句 ${i + 1}/${statements.length}...`);
      const { data, error } = await supabase.rpc('exec_sql', { sql: statement });
      
      if (error) {
        console.error(`❌ 执行失败:`, error.message);
        // 继续执行下一条
      } else {
        console.log(`✅ 执行成功`);
      }
    } catch (err: any) {
      console.error(`❌ 执行异常:`, err.message);
    }
  }
}

async function initDatabase() {
  console.log('='.repeat(60));
  console.log('开始初始化 Supabase 数据库');
  console.log('='.repeat(60));
  
  try {
    // 1. 执行表结构和初始数据
    console.log('\n📦 步骤 1: 创建表结构和初始数据');
    const initSqlPath = path.join(__dirname, 'init.sql');
    if (fs.existsSync(initSqlPath)) {
      await executeSqlFile(initSqlPath);
    } else {
      console.error('❌ 找不到 init.sql 文件');
    }
    
    // 2. 执行函数定义
    console.log('\n📦 步骤 2: 创建数据库函数');
    const functionsSqlPath = path.join(__dirname, 'functions.sql');
    if (fs.existsSync(functionsSqlPath)) {
      await executeSqlFile(functionsSqlPath);
    } else {
      console.error('❌ 找不到 functions.sql 文件');
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ 数据库初始化完成！');
    console.log('='.repeat(60));
    
    // 3. 测试连接
    console.log('\n🧪 测试数据库连接...');
    await testConnection();
    
  } catch (error: any) {
    console.error('\n❌ 初始化失败:', error.message);
    process.exit(1);
  }
}

async function testConnection() {
  try {
    // 测试获取角色列表
    const { data: roles, error: rolesError } = await supabase.rpc('get_role_list');
    
    if (rolesError) {
      console.error('❌ 获取角色列表失败:', rolesError.message);
    } else {
      console.log('✅ 角色列表:', roles);
    }
    
    // 测试获取菜单树
    const { data: menus, error: menusError } = await supabase.rpc('get_all_menu_tree');
    
    if (menusError) {
      console.error('❌ 获取菜单树失败:', menusError.message);
    } else {
      console.log('✅ 菜单树:', JSON.stringify(menus, null, 2));
    }
    
    console.log('\n✅ 数据库连接测试成功！');
    console.log('\n默认管理员账号:');
    console.log('  用户名: admin');
    console.log('  密码: admin123');
    
  } catch (error: any) {
    console.error('❌ 测试连接失败:', error.message);
  }
}

// 执行初始化
initDatabase();
