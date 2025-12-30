# 快速开始 - Supabase 数据库配置

## 🚀 5 分钟快速配置

### 步骤 1: 访问 Supabase Dashboard

打开浏览器，访问你的项目：
```
https://supabase.com/dashboard/project/sjghekubcfmsjcogeatk
```

### 步骤 2: 打开 SQL Editor

1. 在左侧菜单找到 **SQL Editor**
2. 点击 **New query** 创建新查询

### 步骤 3: 执行初始化脚本

#### 3.1 创建表结构和初始数据

1. 打开文件 `db/init.sql`
2. 复制全部内容
3. 粘贴到 SQL Editor
4. 点击右下角 **Run** 按钮执行
5. 等待执行完成（应该显示 "Success"）

#### 3.2 创建数据库函数

1. 打开文件 `db/functions.sql`
2. 复制全部内容
3. 粘贴到 SQL Editor
4. 点击右下角 **Run** 按钮执行
5. 等待执行完成

### 步骤 4: 验证安装

在 SQL Editor 中执行以下查询：

```sql
-- 查看所有表
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 查看角色数据
SELECT * FROM roles;

-- 查看菜单数据
SELECT * FROM menus ORDER BY sort_order;

-- 测试函数
SELECT get_role_list();
```

如果都能正常返回数据，说明初始化成功！

### 步骤 5: 测试连接（可选）

在项目根目录运行：

```bash
npm run db:test
```

应该看到类似输出：
```
✅ 数据库已正确初始化！

默认管理员账号:
  用户名: admin
  密码: admin123
```

## 📝 初始化后的数据

### 默认角色
- 超级管理员 (super_admin)
- 管理员 (admin)
- 普通用户 (user)

### 默认菜单
- 首页 (/)
- 系统管理 (/system)
  - 用户管理 (/system/user)
  - 角色管理 (/system/role)
  - 菜单管理 (/system/menu)
  - 权限管理 (/system/auth)

### 默认账号
- **用户名**: admin
- **密码**: admin123
- **角色**: 超级管理员
- **权限**: 所有菜单

## 🔧 配置说明

项目已配置好 Supabase 连接：

**环境变量** (`.env.development`):
```env
VITE_SUPABASE_URL=https://sjghekubcfmsjcogeatk.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_99o_9q54MWStZPlL5XXU-Q_aHNB4QKT
```

**Supabase 客户端** (`src/utils/supabase.ts`):
```typescript
import { supabase } from '@/utils/supabase';

// 使用示例
const { data, error } = await supabase.rpc('get_role_list');
```

## 📚 可用的数据库函数

| 函数名 | 参数 | 说明 |
|--------|------|------|
| `get_user_menu_tree(user_id)` | user_id: UUID | 获取用户的菜单树 |
| `get_menu_tree_with_role(role_id)` | role_id: UUID | 获取角色的菜单权限（带选中状态） |
| `get_menu_tree_with_user(user_id)` | user_id: UUID | 获取用户的菜单权限（带选中状态） |
| `save_role_menus(role_id, menu_ids)` | role_id: UUID, menu_ids: TEXT | 保存角色菜单权限 |
| `save_user_menus(user_id, menu_ids)` | user_id: UUID, menu_ids: TEXT | 保存用户菜单权限 |
| `get_role_list()` | 无 | 获取所有角色列表 |
| `get_user_list(page, size, status)` | page: INT, size: INT, status: INT | 获取用户列表（分页） |
| `get_all_menu_tree()` | 无 | 获取完整菜单树 |

## 🧪 测试 API

在浏览器控制台测试：

```javascript
// 1. 获取角色列表
const { data: roles } = await supabase.rpc('get_role_list');
console.log('角色:', roles);

// 2. 获取菜单树
const { data: menus } = await supabase.rpc('get_all_menu_tree');
console.log('菜单:', menus);

// 3. 获取用户列表
const { data: users } = await supabase.rpc('get_user_list', {
  page_num: 1,
  page_size: 10,
  status_param: 1
});
console.log('用户:', users);
```

## ⚠️ 注意事项

1. **密码安全**: 默认账号密码为明文存储，仅用于测试。生产环境请使用 bcrypt 加密。

2. **API Key**: 当前使用的是 `anon key`，适合前端调用。如需管理员操作，请使用 `service_role key`。

3. **RLS 策略**: 当前未启用 Row Level Security，所有认证用户可以访问所有数据。生产环境建议启用 RLS。

## 🐛 常见问题

### Q: 执行 SQL 时报错

**A**: 确保按顺序执行：
1. 先执行 `init.sql`（创建表）
2. 再执行 `functions.sql`（创建函数）

### Q: 函数调用失败

**A**: 检查函数是否创建成功：
```sql
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public';
```

### Q: 如何重置数据库

**A**: 在 SQL Editor 执行：
```sql
-- 删除所有表
DROP TABLE IF EXISTS user_menus CASCADE;
DROP TABLE IF EXISTS role_menus CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS menus CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 删除所有函数
DROP FUNCTION IF EXISTS get_user_menu_tree CASCADE;
DROP FUNCTION IF EXISTS get_menu_tree_with_role CASCADE;
DROP FUNCTION IF EXISTS get_menu_tree_with_user CASCADE;
DROP FUNCTION IF EXISTS save_role_menus CASCADE;
DROP FUNCTION IF EXISTS save_user_menus CASCADE;
DROP FUNCTION IF EXISTS get_role_list CASCADE;
DROP FUNCTION IF EXISTS get_user_list CASCADE;
DROP FUNCTION IF EXISTS get_all_menu_tree CASCADE;

-- 然后重新执行 init.sql 和 functions.sql
```

## 📖 更多文档

- [数据库设计](../docs/database-design.md)
- [API 接口设计](../docs/api-design.md)
- [系统架构](../docs/architecture.md)
- [详细配置指南](./README.md)

## ✅ 下一步

数据库配置完成后，你可以：

1. 启动开发服务器: `npm run dev`
2. 访问登录页面，使用默认账号登录
3. 查看动态生成的菜单
4. 在权限管理页面配置角色和用户权限

祝你使用愉快！🎉
