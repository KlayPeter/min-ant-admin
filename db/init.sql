-- ============================================
-- 动态菜单权限系统 - 数据库初始化脚本
-- ============================================

-- Step 1: 创建表结构
-- ============================================

-- 1. 用户表
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  real_name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password_hash TEXT NOT NULL,
  avatar_url TEXT,
  status INTEGER DEFAULT 1, -- 1:启用 0:禁用
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 角色表
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_name VARCHAR(50) UNIQUE NOT NULL,
  role_code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  status INTEGER DEFAULT 1, -- 1:启用 0:禁用
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 菜单表
CREATE TABLE IF NOT EXISTS menus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES menus(id) ON DELETE CASCADE,
  menu_name VARCHAR(100) NOT NULL,
  menu_code VARCHAR(100) UNIQUE NOT NULL,
  menu_type INTEGER NOT NULL, -- 1:目录 2:菜单 3:按钮
  path VARCHAR(200), -- 路由路径
  component VARCHAR(200), -- 组件路径
  icon VARCHAR(100), -- 图标
  sort_order INTEGER DEFAULT 0,
  visible INTEGER DEFAULT 1, -- 1:显示 0:隐藏
  status INTEGER DEFAULT 1, -- 1:启用 0:禁用
  permission_code VARCHAR(200), -- 权限标识
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 用户角色关联表
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

-- 5. 角色菜单权限表
CREATE TABLE IF NOT EXISTS role_menus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  menu_id UUID NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(role_id, menu_id)
);

-- 6. 用户特殊菜单权限表
CREATE TABLE IF NOT EXISTS user_menus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  menu_id UUID NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
  permission_type INTEGER NOT NULL, -- 1:额外授权 2:权限收回
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, menu_id)
);

-- Step 2: 创建索引
-- ============================================

-- 用户表索引
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- 角色表索引
CREATE INDEX IF NOT EXISTS idx_roles_code ON roles(role_code);
CREATE INDEX IF NOT EXISTS idx_roles_status ON roles(status);

-- 菜单表索引
CREATE INDEX IF NOT EXISTS idx_menus_parent_id ON menus(parent_id);
CREATE INDEX IF NOT EXISTS idx_menus_code ON menus(menu_code);
CREATE INDEX IF NOT EXISTS idx_menus_status ON menus(status);

-- 用户角色关联表索引
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);

-- 角色菜单权限表索引
CREATE INDEX IF NOT EXISTS idx_role_menus_role_id ON role_menus(role_id);
CREATE INDEX IF NOT EXISTS idx_role_menus_menu_id ON role_menus(menu_id);

-- 用户菜单权限表索引
CREATE INDEX IF NOT EXISTS idx_user_menus_user_id ON user_menus(user_id);
CREATE INDEX IF NOT EXISTS idx_user_menus_menu_id ON user_menus(menu_id);

-- Step 3: 插入初始数据
-- ============================================

-- 插入默认角色
INSERT INTO roles (role_name, role_code, description, sort_order) 
VALUES
  ('超级管理员', 'super_admin', '拥有所有权限', 1),
  ('管理员', 'admin', '系统管理员', 2),
  ('普通用户', 'user', '普通用户', 3)
ON CONFLICT (role_code) DO NOTHING;

-- 插入默认菜单（一级菜单）
INSERT INTO menus (menu_name, menu_code, menu_type, path, icon, sort_order, parent_id) 
VALUES
  ('首页', 'dashboard', 2, '/', 'HomeOutlined', 1, NULL),
  ('系统管理', 'system', 1, '/system', 'SettingOutlined', 2, NULL)
ON CONFLICT (menu_code) DO NOTHING;

-- 插入系统管理子菜单
DO $$
DECLARE
  system_menu_id UUID;
BEGIN
  -- 获取系统管理菜单ID
  SELECT id INTO system_menu_id FROM menus WHERE menu_code = 'system';
  
  -- 插入子菜单
  INSERT INTO menus (parent_id, menu_name, menu_code, menu_type, path, component, icon, sort_order) 
  VALUES
    (system_menu_id, '用户管理', 'system_user', 2, '/system/user', 'pages/system/user', 'UserOutlined', 1),
    (system_menu_id, '角色管理', 'system_role', 2, '/system/role', 'pages/system/role', 'TeamOutlined', 2),
    (system_menu_id, '菜单管理', 'system_menu', 2, '/system/menu', 'pages/system/menu', 'MenuOutlined', 3),
    (system_menu_id, '权限管理', 'system_auth', 2, '/system/auth', 'pages/system/auth', 'SafetyOutlined', 4)
  ON CONFLICT (menu_code) DO NOTHING;
END $$;

-- 创建测试用户（用户名: admin, 密码: admin123）
-- 注意：这里使用明文密码，实际应用中需要使用 bcrypt 加密
INSERT INTO users (username, real_name, email, password_hash, status) 
VALUES
  ('admin', '系统管理员', 'admin@example.com', 'admin123', 1)
ON CONFLICT (username) DO NOTHING;

-- 给管理员分配超级管理员角色
DO $$
DECLARE
  admin_user_id UUID;
  super_admin_role_id UUID;
BEGIN
  SELECT id INTO admin_user_id FROM users WHERE username = 'admin';
  SELECT id INTO super_admin_role_id FROM roles WHERE role_code = 'super_admin';
  
  INSERT INTO user_roles (user_id, role_id)
  VALUES (admin_user_id, super_admin_role_id)
  ON CONFLICT (user_id, role_id) DO NOTHING;
END $$;

-- 给超级管理员角色分配所有菜单权限
DO $$
DECLARE
  super_admin_role_id UUID;
  menu_record RECORD;
BEGIN
  SELECT id INTO super_admin_role_id FROM roles WHERE role_code = 'super_admin';
  
  FOR menu_record IN SELECT id FROM menus
  LOOP
    INSERT INTO role_menus (role_id, menu_id)
    VALUES (super_admin_role_id, menu_record.id)
    ON CONFLICT (role_id, menu_id) DO NOTHING;
  END LOOP;
END $$;
