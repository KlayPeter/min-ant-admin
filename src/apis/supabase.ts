/**
 * Supabase API 完整封装
 */
import { supabase } from '@/utils/supabase';
import type { Menu, Role, UserListResponse } from '@/utils/supabase';
import { buildTree } from '@/utils/tree';

export default {
  /**
   * 角色相关 API
   */
  role: {
    /**
     * 获取角色列表
     */
    async getRoleAdminList(): Promise<{ data: Role[] }> {
      const { data, error } = await supabase.rpc('get_role_list');
      if (error) throw error;
      return { data: data || [] };
    },

    /**
     * 添加角色
     */
    async addRole(params: {
      roleName: string;
      roleCode: string;
      description?: string;
      sortOrder?: number;
    }): Promise<any> {
      const { data, error } = await supabase.rpc('add_role', {
        role_name_param: params.roleName,
        role_code_param: params.roleCode,
        description_param: params.description || '',
        sort_order_param: params.sortOrder || 0,
      });
      if (error) throw error;
      return data;
    },

    /**
     * 更新角色
     */
    async editRole(params: {
      id: string;
      roleName: string;
      roleCode: string;
      description?: string;
      sortOrder?: number;
    }): Promise<any> {
      const { data, error } = await supabase.rpc('update_role', {
        role_id_param: params.id,
        role_name_param: params.roleName,
        role_code_param: params.roleCode,
        description_param: params.description || '',
        sort_order_param: params.sortOrder || 0,
      });
      if (error) throw error;
      return data;
    },

    /**
     * 删除角色
     */
    async deleteRole(params: { id: string }): Promise<any> {
      const { data, error } = await supabase.rpc('delete_role', {
        role_id_param: params.id,
      });
      if (error) throw error;
      return data;
    },

    /**
     * 获取角色的用户列表
     */
    async getRoleUserList(params: { roleId: string }): Promise<any> {
      const { data, error } = await supabase.rpc('get_role_users', {
        role_id_param: params.roleId,
      });
      if (error) throw error;
      return { data: data || [] };
    },

    /**
     * 更新角色的用户列表
     */
    async UpdateRoleUserList(params: { roleId: string; userIds: string }): Promise<any> {
      const { data, error } = await supabase.rpc('update_role_users', {
        role_id_param: params.roleId,
        user_ids_param: params.userIds,
      });
      if (error) throw error;
      return data;
    },
  },

  /**
   * 用户相关 API
   */
  user: {
    /**
     * 获取用户列表
     */
    async getUserList(params: {
      page?: number;
      rows?: number;
      status?: number;
    }): Promise<UserListResponse> {
      const { data, error } = await supabase.rpc('get_user_list', {
        page_num: params.page || 1,
        page_size: params.rows || 10,
        status_param: params.status,
      });
      if (error) throw error;
      return data || { rows: [], total: 0 };
    },

    /**
     * 添加用户
     */
    async addUser(params: {
      username: string;
      realName: string;
      email: string;
      password: string;
      roleIds?: string;
    }): Promise<any> {
      const { data, error } = await supabase.rpc('add_user', {
        username_param: params.username,
        real_name_param: params.realName,
        email_param: params.email,
        password_param: params.password,
        role_ids_param: params.roleIds || '',
      });
      if (error) throw error;
      return data;
    },

    /**
     * 更新用户
     */
    async editUser(params: {
      userId: string;
      realName: string;
      email: string;
      roleIds?: string;
    }): Promise<any> {
      const { data, error } = await supabase.rpc('update_user', {
        user_id_param: params.userId,
        real_name_param: params.realName,
        email_param: params.email,
        role_ids_param: params.roleIds || '',
      });
      if (error) throw error;
      return data;
    },

    /**
     * 删除用户
     */
    async deleteUser(params: { userId: string }): Promise<any> {
      const { data, error } = await supabase.rpc('delete_user', {
        user_id_param: params.userId,
      });
      if (error) throw error;
      return data;
    },

    /**
     * 修改用户状态
     */
    async changeUserStatus(params: { userId: string; status: number }): Promise<any> {
      const { data, error } = await supabase.rpc('change_user_status', {
        user_id_param: params.userId,
        status_param: params.status,
      });
      if (error) throw error;
      return data;
    },

    /**
     * 获取角色列表（用于用户管理）
     */
    async getRoleList(): Promise<{ data: Role[] }> {
      const { data, error } = await supabase.rpc('get_role_list');
      if (error) throw error;
      return { data: data || [] };
    },
  },

  /**
   * 菜单相关 API
   */
  menu: {
    /**
     * 获取所有菜单（扁平列表）
     */
    async getMenuTree(): Promise<{ data: Menu[] }> {
      const { data, error } = await supabase.rpc('get_all_menu_tree');
      if (error) throw error;
      const menus = data || [];
      return { data: buildTree<Menu>(menus) };
    },

    /**
     * 添加菜单
     */
    async addMenuTree(params: {
      parentId?: string;
      menuName: string;
      menuCode: string;
      menuType: number;
      path?: string;
      component?: string;
      icon?: string;
      sortOrder?: number;
      visible?: number;
      permissionCode?: string;
    }): Promise<any> {
      const { data, error } = await supabase.rpc('add_menu', {
        parent_id_param: params.parentId || null,
        menu_name_param: params.menuName,
        menu_code_param: params.menuCode,
        menu_type_param: params.menuType,
        path_param: params.path || '',
        component_param: params.component || '',
        icon_param: params.icon || '',
        sort_order_param: params.sortOrder || 0,
        visible_param: params.visible ?? 1,
        permission_code_param: params.permissionCode || '',
      });
      if (error) throw error;
      return data;
    },

    /**
     * 更新菜单
     */
    async editMenuTree(params: {
      id: string;
      parentId?: string;
      menuName: string;
      menuCode: string;
      menuType: number;
      path?: string;
      component?: string;
      icon?: string;
      sortOrder?: number;
      visible?: number;
      permissionCode?: string;
    }): Promise<any> {
      const { data, error } = await supabase.rpc('update_menu', {
        menu_id_param: params.id,
        parent_id_param: params.parentId || null,
        menu_name_param: params.menuName,
        menu_code_param: params.menuCode,
        menu_type_param: params.menuType,
        path_param: params.path || '',
        component_param: params.component || '',
        icon_param: params.icon || '',
        sort_order_param: params.sortOrder || 0,
        visible_param: params.visible ?? 1,
        permission_code_param: params.permissionCode || '',
      });
      if (error) throw error;
      return data;
    },

    /**
     * 删除菜单
     */
    async deleteMenuById(params: { id: string }): Promise<any> {
      const { data, error } = await supabase.rpc('delete_menu', {
        menu_id_param: params.id,
      });
      if (error) throw error;
      return data;
    },
  },

  /**
   * 权限相关 API
   */
  auth: {
    /**
     * 获取角色的菜单权限（带选中状态）
     */
    async getMenuTreeWithRole(params: { roleId: string }): Promise<{ data: Menu[] }> {
      const { data, error } = await supabase.rpc('get_menu_tree_with_role', {
        role_id_param: params.roleId,
      });
      if (error) throw error;
      const menus = data || [];
      return { data: buildTree<Menu>(menus) };
    },

    /**
     * 获取用户的菜单权限（带选中状态）
     */
    async getMenuTreeWithUser(params: { userId: string; status?: number }): Promise<{ data: Menu[] }> {
      const { data, error } = await supabase.rpc('get_menu_tree_with_user', {
        user_id_param: params.userId,
      });
      if (error) throw error;
      const menus = data || [];
      return { data: buildTree<Menu>(menus) };
    },

    /**
     * 保存角色菜单权限
     */
    async saveRoleMenu(params: { roleId: string; menuIds: string }): Promise<any> {
      const { data, error } = await supabase.rpc('save_role_menus', {
        role_id_param: params.roleId,
        menu_ids_param: params.menuIds,
      });
      if (error) throw error;
      return data;
    },

    /**
     * 保存用户菜单权限
     */
    async saveUserMenu(params: { userId: string; menuIds: string }): Promise<any> {
      const { data, error } = await supabase.rpc('save_user_menus', {
        user_id_param: params.userId,
        menu_ids_param: params.menuIds,
      });
      if (error) throw error;
      return data;
    },
  },
};
