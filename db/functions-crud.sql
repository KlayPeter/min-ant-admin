-- ============================================
-- CRUD 操作函数
-- ============================================

-- 1. 添加用户
-- ============================================
CREATE OR REPLACE FUNCTION add_user(
  username_param VARCHAR,
  real_name_param VARCHAR,
  email_param VARCHAR,
  password_param VARCHAR,
  role_ids_param TEXT
)
RETURNS JSON AS $$
DECLARE
  new_user_id UUID;
  role_id_array TEXT[];
  role_id_str TEXT;
  role_id_uuid UUID;
BEGIN
  -- 插入用户
  INSERT INTO users (username, real_name, email, password_hash, status)
  VALUES (username_param, real_name_param, email_param, password_param, 1)
  RETURNING id INTO new_user_id;
  
  -- 分配角色
  IF role_ids_param IS NOT NULL AND role_ids_param != '' THEN
    role_id_array := string_to_array(role_ids_param, ',');
    FOREACH role_id_str IN ARRAY role_id_array
    LOOP
      role_id_uuid := role_id_str::UUID;
      INSERT INTO user_roles (user_id, role_id)
      VALUES (new_user_id, role_id_uuid)
      ON CONFLICT (user_id, role_id) DO NOTHING;
    END LOOP;
  END IF;
  
  RETURN json_build_object('success', true, 'message', '添加成功', 'userId', new_user_id);
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$ LANGUAGE plpgsql;

-- 2. 更新用户
-- ============================================
CREATE OR REPLACE FUNCTION update_user(
  user_id_param UUID,
  real_name_param VARCHAR,
  email_param VARCHAR,
  role_ids_param TEXT
)
RETURNS JSON AS $$
DECLARE
  role_id_array TEXT[];
  role_id_str TEXT;
  role_id_uuid UUID;
BEGIN
  -- 更新用户信息
  UPDATE users
  SET real_name = real_name_param,
      email = email_param,
      updated_at = NOW()
  WHERE id = user_id_param;
  
  -- 删除旧的角色关联
  DELETE FROM user_roles WHERE user_id = user_id_param;
  
  -- 添加新的角色关联
  IF role_ids_param IS NOT NULL AND role_ids_param != '' THEN
    role_id_array := string_to_array(role_ids_param, ',');
    FOREACH role_id_str IN ARRAY role_id_array
    LOOP
      role_id_uuid := role_id_str::UUID;
      INSERT INTO user_roles (user_id, role_id)
      VALUES (user_id_param, role_id_uuid)
      ON CONFLICT (user_id, role_id) DO NOTHING;
    END LOOP;
  END IF;
  
  RETURN json_build_object('success', true, 'message', '更新成功');
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$ LANGUAGE plpgsql;

-- 3. 删除用户
-- ============================================
CREATE OR REPLACE FUNCTION delete_user(user_id_param UUID)
RETURNS JSON AS $$
BEGIN
  DELETE FROM users WHERE id = user_id_param;
  RETURN json_build_object('success', true, 'message', '删除成功');
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$ LANGUAGE plpgsql;

-- 4. 修改用户状态
-- ============================================
CREATE OR REPLACE FUNCTION change_user_status(
  user_id_param UUID,
  status_param INTEGER
)
RETURNS JSON AS $$
BEGIN
  UPDATE users SET status = status_param, updated_at = NOW()
  WHERE id = user_id_param;
  
  RETURN json_build_object('success', true, 'message', '状态修改成功');
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$ LANGUAGE plpgsql;

-- 5. 添加角色
-- ============================================
CREATE OR REPLACE FUNCTION add_role(
  role_name_param VARCHAR,
  role_code_param VARCHAR,
  description_param TEXT,
  sort_order_param INTEGER
)
RETURNS JSON AS $$
DECLARE
  new_role_id UUID;
BEGIN
  INSERT INTO roles (role_name, role_code, description, sort_order, status)
  VALUES (role_name_param, role_code_param, description_param, sort_order_param, 1)
  RETURNING id INTO new_role_id;
  
  RETURN json_build_object('success', true, 'message', '添加成功', 'roleId', new_role_id);
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$ LANGUAGE plpgsql;

-- 6. 更新角色
-- ============================================
CREATE OR REPLACE FUNCTION update_role(
  role_id_param UUID,
  role_name_param VARCHAR,
  role_code_param VARCHAR,
  description_param TEXT,
  sort_order_param INTEGER
)
RETURNS JSON AS $$
BEGIN
  UPDATE roles
  SET role_name = role_name_param,
      role_code = role_code_param,
      description = description_param,
      sort_order = sort_order_param,
      updated_at = NOW()
  WHERE id = role_id_param;
  
  RETURN json_build_object('success', true, 'message', '更新成功');
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$ LANGUAGE plpgsql;

-- 7. 删除角色
-- ============================================
CREATE OR REPLACE FUNCTION delete_role(role_id_param UUID)
RETURNS JSON AS $$
BEGIN
  DELETE FROM roles WHERE id = role_id_param;
  RETURN json_build_object('success', true, 'message', '删除成功');
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$ LANGUAGE plpgsql;

-- 8. 添加菜单
-- ============================================
CREATE OR REPLACE FUNCTION add_menu(
  parent_id_param UUID,
  menu_name_param VARCHAR,
  menu_code_param VARCHAR,
  menu_type_param INTEGER,
  path_param VARCHAR,
  component_param VARCHAR,
  icon_param VARCHAR,
  sort_order_param INTEGER,
  visible_param INTEGER,
  permission_code_param VARCHAR
)
RETURNS JSON AS $$
DECLARE
  new_menu_id UUID;
BEGIN
  INSERT INTO menus (
    parent_id, menu_name, menu_code, menu_type, path, component,
    icon, sort_order, visible, status, permission_code
  )
  VALUES (
    parent_id_param, menu_name_param, menu_code_param, menu_type_param,
    path_param, component_param, icon_param, sort_order_param,
    visible_param, 1, permission_code_param
  )
  RETURNING id INTO new_menu_id;
  
  RETURN json_build_object('success', true, 'message', '添加成功', 'menuId', new_menu_id);
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$ LANGUAGE plpgsql;

-- 9. 更新菜单
-- ============================================
CREATE OR REPLACE FUNCTION update_menu(
  menu_id_param UUID,
  parent_id_param UUID,
  menu_name_param VARCHAR,
  menu_code_param VARCHAR,
  menu_type_param INTEGER,
  path_param VARCHAR,
  component_param VARCHAR,
  icon_param VARCHAR,
  sort_order_param INTEGER,
  visible_param INTEGER,
  permission_code_param VARCHAR
)
RETURNS JSON AS $$
BEGIN
  UPDATE menus
  SET parent_id = parent_id_param,
      menu_name = menu_name_param,
      menu_code = menu_code_param,
      menu_type = menu_type_param,
      path = path_param,
      component = component_param,
      icon = icon_param,
      sort_order = sort_order_param,
      visible = visible_param,
      permission_code = permission_code_param,
      updated_at = NOW()
  WHERE id = menu_id_param;
  
  RETURN json_build_object('success', true, 'message', '更新成功');
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$ LANGUAGE plpgsql;

-- 10. 删除菜单
-- ============================================
CREATE OR REPLACE FUNCTION delete_menu(menu_id_param UUID)
RETURNS JSON AS $$
BEGIN
  DELETE FROM menus WHERE id = menu_id_param;
  RETURN json_build_object('success', true, 'message', '删除成功');
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$ LANGUAGE plpgsql;

-- 11. 获取角色的用户列表
-- ============================================
CREATE OR REPLACE FUNCTION get_role_users(role_id_param UUID)
RETURNS JSON AS $$
BEGIN
  RETURN (
    SELECT COALESCE(json_agg(
      json_build_object(
        'userId', u.id,
        'username', u.username,
        'realName', u.real_name,
        'email', u.email,
        'status', u.status
      )
    ), '[]'::json)
    FROM users u
    INNER JOIN user_roles ur ON u.id = ur.user_id
    WHERE ur.role_id = role_id_param
  );
END;
$$ LANGUAGE plpgsql;

-- 12. 更新角色的用户列表
-- ============================================
CREATE OR REPLACE FUNCTION update_role_users(
  role_id_param UUID,
  user_ids_param TEXT
)
RETURNS JSON AS $$
DECLARE
  user_id_array TEXT[];
  user_id_str TEXT;
  user_id_uuid UUID;
BEGIN
  -- 删除该角色的所有用户关联
  DELETE FROM user_roles WHERE role_id = role_id_param;
  
  -- 添加新的用户关联
  IF user_ids_param IS NOT NULL AND user_ids_param != '' THEN
    user_id_array := string_to_array(user_ids_param, ',');
    FOREACH user_id_str IN ARRAY user_id_array
    LOOP
      user_id_uuid := user_id_str::UUID;
      INSERT INTO user_roles (user_id, role_id)
      VALUES (user_id_uuid, role_id_param)
      ON CONFLICT (user_id, role_id) DO NOTHING;
    END LOOP;
  END IF;
  
  RETURN json_build_object('success', true, 'message', '更新成功');
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$ LANGUAGE plpgsql;
