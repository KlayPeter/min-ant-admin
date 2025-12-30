/**
 * Supabase API 封装
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
    async getRoleList(): Promise<Role[]> {
      const { data, error } = await supabase.rpc('get_role_list');
      if (error) throw error;
      return data || [];
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
  },

  /**
   * 菜单相关 API
   */
  menu: {
    /**
     * 获取所有菜单（扁平列表）
     */
    async getAllMenus(): Promise<Menu[]> {
      const { data, error } = await supabase.rpc('get_all_menu_tree');
      if (error) throw error;
      return data || [];
    },

    /**
     * 获取所有菜单（树形结构）
     */
    async getAllMenuTree(): Promise<Menu[]> {
      const { data, error } = await supabase.rpc('get_all_menu_tree');
      if (error) throw error;
      const menus = data || [];
      return buildTree<Menu>(menus);
    },

    /**
     * 获取用户菜单（扁平列表）
     */
    async getUserMenus(userId: string): Promise<Menu[]> {
      const { data, error } = await supabase.rpc('get_user_menu_tree', {
        user_id_param: userId,
      });
      if (error) throw error;
      return data || [];
    },

    /**
     * 获取用户菜单（树形结构）
     */
    async getUserMenuTree(userId: string): Promise<Menu[]> {
      const { data, error } = await supabase.rpc('get_user_menu_tree', {
        user_id_param: userId,
      });
      if (error) throw error;
      const menus = data || [];
      return buildTree<Menu>(menus);
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
