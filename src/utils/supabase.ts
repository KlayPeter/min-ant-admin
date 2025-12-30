import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sjghekubcfmsjcogeatk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_99o_9q54MWStZPlL5XXU-Q_aHNB4QKT';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 类型定义
export interface User {
  id: string;
  username: string;
  real_name?: string;
  email?: string;
  avatar_url?: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  role_name: string;
  role_code: string;
  description?: string;
  status: number;
  sort_order: number;
  created_at: string;
}

export interface Menu {
  id: string;
  parentId?: string;
  menuName: string;
  menuCode: string;
  menuType: number;
  path?: string;
  component?: string;
  icon?: string;
  sortOrder: number;
  visible?: number;
  status?: number;
  permissionCode?: string;
  children?: Menu[];
  ck?: boolean; // 用于权限配置页面
  src?: string; // 兼容旧接口
  seq?: number; // 兼容旧接口
}

export interface UserListResponse {
  rows: Array<{
    userId: string;
    username: string;
    realName?: string;
    email?: string;
    avatarUrl?: string;
    status: number;
    createdAt: string;
    roles: Role[];
  }>;
  total: number;
}
