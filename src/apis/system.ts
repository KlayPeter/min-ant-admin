/**
 * 系统管理相关 API
 */
import request from '@/utils/request';

export default {
  role: {
    getRoleAdminList: request('/manage/sys/role/getRoleAdminList', 'post'),
    getAllRoles: request('/manage/sys/role/getAllRoles', 'post'),
    addRole: request('/manage/sys/role/addRole', 'post'),
    editRole: request('/manage/sys/role/editRole', 'post'),
    deleteRole: request('/manage/sys/role/deleteRole', 'post'),
    getRoleUserList: request('/manage/sys/role/getRoleUserList', 'post'),
    UpdateRoleUserList: request('/manage/sys/role/UpdateRoleUserList', 'post'),
  },
  user: {
    getUserList: request('/manage/sys/user/getUserList', 'post'),
    addUser: request('/manage/sys/user/addUser', 'post'),
    editUser: request('/manage/sys/user/editUser', 'post'),
    deleteUser: request('/manage/sys/user/deleteUser', 'post'),
    changeUserStatus: request('/manage/sys/user/changeUserStatus', 'post'),
    getRoleList: request('/manage/sys/role/getAllRoles', 'post'),
  },
  menu: {
    getMenuTree: request('/manage/sys/menu/getMenuTree', 'post'),
    addMenuTree: request('/manage/sys/menu/addMenuTree', 'post'),
    editMenuTree: request('/manage/sys/menu/editMenuTree', 'post'),
    deleteMenuById: request('/manage/sys/menu/deleteMenuById', 'post'),
  },
  auth: {
    getMenuTreeWithRole: request('/manage/sys/auth/getMenuTreeWithRole', 'post'),
    getMenuTreeWithUser: request('/manage/sys/auth/getMenuTreeWithUser', 'post'),
    saveRoleMenu: request('/manage/sys/auth/saveRoleMenu', 'post'),
  },
};
