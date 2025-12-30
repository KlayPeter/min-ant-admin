import request from '@/utils/request';

export default {
  org: {
    getSyncGridTree: request('/manage/sys/org/getSyncGridTree', 'GET', {
      raw: true,
      ignoreResponseCode: true,
    }),
  },
  user: {
    getUserList: request('/manage/sys/orgUser/admin/list', 'GET', {
      raw: true,
      ignoreResponseCode: true,
    }),
    changeUserStatus: request('/manage/sys/user/admin/changeStatus', 'POST', {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
    getRoleList: request('/manage/sys/role/getList', 'GET', {
      raw: true,
      ignoreResponseCode: true,
    }),
    addUser: request('/manage/sys/orgUser/admin/add', 'POST'),
    editUser: request('/manage/sys/orgUser/admin/update', 'POST'),
    deleteUser: request('/manage/sys/orgUser/admin/delete', 'POST', {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
    forceChangePassword: request('/manage/sys/user/admin/changePassWord', 'POST'),
  },
  role: {
    getRoleAdminList: request('/manage/sys/role/getList', 'GET', {
      raw: true,
      ignoreResponseCode: true,
    }),
    addRole: request('/manage/sys/role/admin/add', 'POST', {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
    editRole: request('/manage/sys/role/admin/update', 'POST', {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
    deleteRole: request('/manage/sys/role/admin/deleteById', 'POST', {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
    getRoleUserList: request('/manage/sys/sysRoleUser/getRoleUsersInfo', 'POST', {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
    UpdateRoleUserList: request('/manage/sys/sysRoleUser/updateRoleUsers', 'POST', {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  },
  menu: {
    getMenuTree: request('/manage/sys/menu/getSyncGridTree', 'GET', {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      raw: true,
      ignoreResponseCode: true,
    }),
    deleteMenuById: request('/manage/sys/menu/deleteById', 'POST', {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
    addMenuTree: request('/manage/sys/menu/admin/add', 'POST', {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
    editMenuTree: request('/manage/sys/menu/admin/update', 'POST', {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  },
  auth: {
    getMenuTreeWithRole: request('/manage/sys/auth/getMenuTreeWithRole', 'GET', {
      raw: true,
      ignoreResponseCode: true,
    }),
    getMenuTreeWithUser: request('/manage/sys/auth/getMenuTreeWithUser', 'GET', {
      raw: true,
      ignoreResponseCode: true,
    }),
    saveRoleMenu: request('/manage/sys/auth/saveRoleMenu', 'POST', {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
    saveUserMenu: request('/manage/sys/auth/saveUserMenu', 'POST', {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  },
};
