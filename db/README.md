# 数据库初始化指南

## 方式一：通过 Supabase Dashboard（推荐）

### 步骤 1: 登录 Supabase Dashboard

访问: https://supabase.com/dashboard/project/sjghekubcfmsjcogeatk

### 步骤 2: 打开 SQL Editor

在左侧菜单找到 "SQL Editor"

### 步骤 3: 执行初始化脚本

1. **创建表结构和初始数据**
   - 复制 `db/init.sql` 的全部内容
   - 粘贴到 SQL Editor
   - 点击 "Run" 执行

2. **创建数据库函数**
   - 复制 `db/functions.sql` 的全部内容
   - 粘贴到 SQL Editor
   - 点击 "Run" 执行

### 步骤 4: 验证初始化

在 SQL Editor 中执行以下查询验证：

```sql
-- 查看所有表
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- 查看角色数据
SELECT * FROM roles;

-- 查看菜单数据
SELECT * FROM menus;

-- 测试函数
SELECT get_role_list();
SELECT get_all_menu_tree();
```

## 方式二：使用 Supabase CLI

### 安装 Supabase CLI

```bash
npm install -g supabase
```

### 登录并连接项目

```bash
supabase login
supabase link --project-ref sjghekubcfmsjcogeatk
```

### 执行 SQL 文件

```bash
supabase db push
```

## 默认账号信息

初始化完成后，系统会创建一个默认管理员账号：

- **用户名**: admin
- **密码**: admin123
- **角色**: 超级管理员

⚠️ **重要提示**: 
- 这是测试账号，密码为明文存储
- 生产环境请务必修改密码并使用加密存储
- 建议使用 bcrypt 对密码进行加密

## 数据库结构说明

### 核心表

1. **users** - 用户表
2. **roles** - 角色表
3. **menus** - 菜单表
4. **user_roles** - 用户角色关联表
5. **role_menus** - 角色菜单权限表
6. **user_menus** - 用户特殊菜单权限表

### 核心函数

1. `get_user_menu_tree(user_id)` - 获取用户菜单树
2. `get_menu_tree_with_role(role_id)` - 获取角色菜单权限
3. `get_menu_tree_with_user(user_id)` - 获取用户菜单权限
4. `save_role_menus(role_id, menu_ids)` - 保存角色菜单权限
5. `save_user_menus(user_id, menu_ids)` - 保存用户菜单权限
6. `get_role_list()` - 获取角色列表
7. `get_user_list(page, size, status)` - 获取用户列表
8. `get_all_menu_tree()` - 获取完整菜单树

## 测试 API

在浏览器控制台或前端代码中测试：

```javascript
import { supabase } from '@/utils/supabase';

// 测试获取角色列表
const { data: roles } = await supabase.rpc('get_role_list');
console.log('角色列表:', roles);

// 测试获取菜单树
const { data: menus } = await supabase.rpc('get_all_menu_tree');
console.log('菜单树:', menus);

// 测试获取用户列表
const { data: users } = await supabase.rpc('get_user_list', {
  page_num: 1,
  page_size: 10,
  status_param: 1
});
console.log('用户列表:', users);
```

## 常见问题

### Q: 执行 SQL 时报错 "permission denied"

A: 确保使用的是 service_role key，而不是 anon key。在 Supabase Dashboard 的 Settings > API 中可以找到。

### Q: 函数执行失败

A: 检查函数是否正确创建：
```sql
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public';
```

### Q: 如何重置数据库

A: 在 SQL Editor 中执行：
```sql
-- 删除所有表（谨慎操作！）
DROP TABLE IF EXISTS user_menus CASCADE;
DROP TABLE IF EXISTS role_menus CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS menus CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 然后重新执行 init.sql 和 functions.sql
```

## 下一步

数据库初始化完成后，可以：

1. 在前端集成 Supabase 客户端
2. 实现用户登录功能
3. 实现动态菜单加载
4. 实现权限管理功能

参考文档：
- `docs/database-design.md` - 数据库设计详解
- `docs/api-design.md` - API 接口详解
- `docs/architecture.md` - 系统架构设计
