import request from '@/utils/request';
import supabaseApi from './supabase';

// 使用 Supabase API 替代原有接口
export default {
  org: {
    getSyncGridTree: request('/manage/sys/org/getSyncGridTree', 'GET', {
      raw: true,
      ignoreResponseCode: true,
    }),
  },
  user: supabaseApi.user,
  role: supabaseApi.role,
  menu: supabaseApi.menu,
  auth: supabaseApi.auth,
};
