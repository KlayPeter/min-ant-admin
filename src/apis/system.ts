/**
 * 系统管理相关 API
 */
import request from '@/utils/request';

export default {
  role: {
    getRoleList: request('/manage/sys/role/getRoleList', 'post'),
    getAllRoles: request('/manage/sys/role/getAllRoles', 'post'),
    addRole: request('/manage/sys/role/addRole', 'post'),
    editRole: request('/manage/sys/role/editRole', 'post'),
    deleteRole: request('/manage/sys/role/deleteRole', 'post'),
    changeRoleStatus: request('/manage/sys/role/changeRoleStatus', 'post'),
    getRoleUserList: request('/manage/sys/role/getRoleUserList', 'post'),
    updateRoleUserList: request('/manage/sys/role/updateRoleUserList', 'post'),
  },
  user: {
    getUserList: request('/manage/sys/user/getUserList', 'post'),
    addUser: request('/manage/sys/user/addUser', 'post'),
    editUser: request('/manage/sys/user/editUser', 'post'),
    deleteUser: request('/manage/sys/user/deleteUser', 'post'),
    changeUserStatus: request('/manage/sys/user/changeUserStatus', 'post'),
    resetPassword: request('/manage/sys/user/resetPassword', 'post'),
    getRoleList: request('/manage/sys/role/getAllRoles', 'post'),
  },
  menu: {
    getMenuTree: request('/manage/sys/menu/getMenuTree', 'post'),
    addMenu: request('/manage/sys/menu/addMenu', 'post'),
    editMenu: request('/manage/sys/menu/editMenu', 'post'),
    deleteMenu: request('/manage/sys/menu/deleteMenu', 'post'),
  },
  auth: {
    getRoleMenuTree: request('/manage/sys/auth/getRoleMenuTree', 'post'),
    saveRoleMenu: request('/manage/sys/auth/saveRoleMenu', 'post'),
    getUserMenuTree: request('/manage/sys/auth/getUserMenuTree', 'post'),
    saveUserMenu: request('/manage/sys/auth/saveUserMenu', 'post'),
    getUserFinalMenus: request('/manage/sys/auth/getUserFinalMenus', 'post'),
  },
  login: request('/manage/sys/login', 'post'),
};
