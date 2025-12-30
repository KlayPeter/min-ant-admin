-- ============================================
-- 数据库函数定义
-- 注意：请逐个执行每个函数，不要一次性全部执行
-- ============================================

-- 1. 获取用户菜单树（核心接口）
-- ============================================
CREATE OR REPLACE FUNCTION get_user_menu_tree(user_id_param UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  WITH user_menu_ids AS (
    SELECT DISTINCT rm.menu_id
    FROM role_menus rm
    INNER JOIN user_roles ur ON rm.role_id = ur.role_id
    WHERE ur.user_id = user_id_param
    UNION
    SELECT menu_id FROM user_menus
    WHERE user_id = user_id_param AND permission_type = 1
    EXCEPT
    SELECT menu_id FROM user_menus
    WHERE user_id = user_id_param AND permission_type = 2
  )
  SELECT json_agg(
    json_build_object(
      'id', m.id,
      'parentId', m.parent_id,
      'menuName', m.menu_name,
      'menuCode', m.menu_code,
      'menuType', m.menu_type,
      'path', m.path,
      'component', m.component,
      'icon', m.icon,
      'sortOrder', m.sort_order
    ) ORDER BY m.sort_order
  ) INTO result
  FROM menus m
  WHERE m.id IN (SELECT menu_id FROM user_menu_ids)
    AND m.status = 1
    AND m.visible = 1;
  
  RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql;

-- 2. 获取所有菜单树（带角色权限标记）
-- ============================================
CREATE OR REPLACE FUNCTION get_menu_tree_with_role(role_id_param UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_agg(
    json_build_object(
      'id', m.id,
      'parentId', m.parent_id,
      'menuName', m.menu_name,
      'src', m.path,
      'seq', m.sort_order,
      'ck', CASE WHEN rm.menu_id IS NOT NULL THEN true ELSE false END
    ) ORDER BY m.sort_order
  ) INTO result
  FROM menus m
  LEFT JOIN role_menus rm ON m.id = rm.menu_id AND rm.role_id = role_id_param
  WHERE m.status = 1;
  
  RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql;

-- 3. 获取所有菜单树（带用户权限标记）
-- ============================================
CREATE OR REPLACE FUNCTION get_menu_tree_with_user(user_id_param UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  WITH user_all_menus AS (
    SELECT DISTINCT rm.menu_id
    FROM role_menus rm
    INNER JOIN user_roles ur ON rm.role_id = ur.role_id
    WHERE ur.user_id = user_id_param
    UNION
    SELECT menu_id FROM user_menus
    WHERE user_id = user_id_param AND permission_type = 1
    EXCEPT
    SELECT menu_id FROM user_menus
    WHERE user_id = user_id_param AND permission_type = 2
  )
  SELECT json_agg(
    json_build_object(
      'id', m.id,
      'parentId', m.parent_id,
      'menuName', m.menu_name,
      'src', m.path,
      'seq', m.sort_order,
      'ck', CASE WHEN uam.menu_id IS NOT NULL THEN true ELSE false END
    ) ORDER BY m.sort_order
  ) INTO result
  FROM menus m
  LEFT JOIN user_all_menus uam ON m.id = uam.menu_id
  WHERE m.status = 1;
  
  RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql;

-- 4. 保存角色菜单权限
-- ============================================
CREATE OR REPLACE FUNCTION save_role_menus(
  role_id_param UUID,
  menu_ids_param TEXT
)
RETURNS JSON AS $$
DECLARE
  menu_id_array TEXT[];
  menu_id_str TEXT;
  menu_id_uuid UUID;
BEGIN
  menu_id_array := string_to_array(menu_ids_param, ',');
  DELETE FROM role_menus WHERE role_id = role_id_param;
  
  FOREACH menu_id_str IN ARRAY menu_id_array
  LOOP
    menu_id_uuid := menu_id_str::UUID;
    INSERT INTO role_menus (role_id, menu_id)
    VALUES (role_id_param, menu_id_uuid)
    ON CONFLICT (role_id, menu_id) DO NOTHING;
  END LOOP;
  
  RETURN json_build_object('success', true, 'message', '保存成功');
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$ LANGUAGE plpgsql;

-- 5. 保存用户菜单权限
-- ============================================
CREATE OR REPLACE FUNCTION save_user_menus(
  user_id_param UUID,
  menu_ids_param TEXT
)
RETURNS JSON AS $$
DECLARE
  menu_id_array TEXT[];
  menu_id_str TEXT;
  menu_id_uuid UUID;
BEGIN
  menu_id_array := string_to_array(menu_ids_param, ',');
  DELETE FROM user_menus WHERE user_id = user_id_param;
  
  FOREACH menu_id_str IN ARRAY menu_id_array
  LOOP
    menu_id_uuid := menu_id_str::UUID;
    INSERT INTO user_menus (user_id, menu_id, permission_type)
    VALUES (user_id_param, menu_id_uuid, 1)
    ON CONFLICT (user_id, menu_id) DO UPDATE SET permission_type = 1;
  END LOOP;
  
  RETURN json_build_object('success', true, 'message', '保存成功');
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$ LANGUAGE plpgsql;

-- 6. 获取角色列表
-- ============================================
CREATE OR REPLACE FUNCTION get_role_list()
RETURNS JSON AS $$
BEGIN
  RETURN (
    SELECT COALESCE(json_agg(
      json_build_object(
        'id', r.id,
        'roleName', r.role_name,
        'roleCode', r.role_code,
        'description', r.description,
        'status', r.status,
        'sortOrder', r.sort_order,
        'createdAt', r.created_at
      ) ORDER BY r.sort_order
    ), '[]'::json)
    FROM roles r
  );
END;
$$ LANGUAGE plpgsql;

-- 7. 获取用户列表
-- ============================================
CREATE OR REPLACE FUNCTION get_user_list(
  page_num INTEGER DEFAULT 1,
  page_size INTEGER DEFAULT 10,
  status_param INTEGER DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  result JSON;
  total_count INTEGER;
  offset_val INTEGER;
BEGIN
  offset_val := (page_num - 1) * page_size;
  
  SELECT COUNT(*) INTO total_count
  FROM users
  WHERE (status_param IS NULL OR status = status_param);
  
  SELECT json_build_object(
    'rows', COALESCE(json_agg(
      json_build_object(
        'userId', u.id,
        'username', u.username,
        'realName', u.real_name,
        'email', u.email,
        'avatarUrl', u.avatar_url,
        'status', u.status,
        'createdAt', u.created_at,
        'roles', (
          SELECT COALESCE(json_agg(json_build_object(
            'id', r.id,
            'roleName', r.role_name
          )), '[]'::json)
          FROM roles r
          INNER JOIN user_roles ur ON r.id = ur.role_id
          WHERE ur.user_id = u.id
        )
      )
    ), '[]'::json),
    'total', total_count
  ) INTO result
  FROM (
    SELECT * FROM users
    WHERE (status_param IS NULL OR status = status_param)
    ORDER BY created_at DESC
    LIMIT page_size OFFSET offset_val
  ) u;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 8. 获取完整菜单树
-- ============================================
CREATE OR REPLACE FUNCTION get_all_menu_tree()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_agg(
    json_build_object(
      'id', m.id,
      'parentId', m.parent_id,
      'menuName', m.menu_name,
      'menuCode', m.menu_code,
      'menuType', m.menu_type,
      'path', m.path,
      'component', m.component,
      'icon', m.icon,
      'sortOrder', m.sort_order,
      'visible', m.visible,
      'status', m.status,
      'permissionCode', m.permission_code
    ) ORDER BY m.sort_order
  ) INTO result
  FROM menus m;
  
  RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql;
