import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Admin System API',
    version: '1.0.0',
    description: '后台管理系统 API 文档 - 自动生成',
  },
  host: 'localhost:8080',
  schemes: ['http'],
  tags: [
    { name: '用户管理', description: '用户相关接口' },
    { name: '角色管理', description: '角色相关接口' },
    { name: '菜单管理', description: '菜单相关接口' },
    { name: '权限管理', description: '权限相关接口' }
  ],
  definitions: {
    User: {
      userId: '507f1f77bcf86cd799439011',
      realName: '张三',
      email: 'zhangsan@example.com',
      avatarUrl: 'https://example.com/avatar.jpg',
      status: 1,
      createdAt: '2024-01-01T00:00:00.000Z',
      roles: [
        {
          id: '507f1f77bcf86cd799439012',
          roleName: '管理员'
        }
      ]
    },
    UserList: {
      rows: [{ $ref: '#/definitions/User' }],
      total: 100
    },
    Role: {
      id: '507f1f77bcf86cd799439011',
      roleName: '管理员',
      roleCode: 'admin',
      description: '系统管理员',
      status: 1,
      sortOrder: 1,
      createdAt: '2024-01-01T00:00:00.000Z'
    },
    RoleList: {
      rows: [{ $ref: '#/definitions/Role' }],
      total: 10
    },
    Menu: {
      id: '507f1f77bcf86cd799439011',
      parentId: null,
      menuName: '系统管理',
      menuCode: 'system',
      menuType: 1,
      path: '/system',
      component: 'Layout',
      icon: 'SettingOutlined',
      sortOrder: 1,
      visible: 1,
      status: 1,
      permissionCode: 'system:view'
    },
    MenuTree: {
      id: '507f1f77bcf86cd799439011',
      parentId: null,
      menuName: '系统管理',
      src: '/system',
      seq: 1,
      ck: true
    },
    Response: {
      success: true,
      data: {},
      message: '操作成功'
    }
  }
};

const outputFile = './swagger-output.json';
const routes = ['./src/index.js'];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, routes, doc);
