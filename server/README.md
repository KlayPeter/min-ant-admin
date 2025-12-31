# Admin System Backend

Node.js + Express + MongoDB 后端服务

## 环境要求

- Node.js >= 18
- MongoDB >= 6.0

## 快速开始

### 1. 安装依赖

```bash
cd server
npm install
```

### 2. 配置环境变量

编辑 `.env` 文件：

```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017/admin_system
JWT_SECRET=your-secret-key-change-in-production
```

### 3. 启动 MongoDB

确保 MongoDB 服务已启动。如果使用 Docker：

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. 初始化数据

```bash
npm run init
```

这会创建：
- 3 个默认角色（超级管理员、管理员、普通用户）
- 6 个默认菜单
- 1 个管理员账号

**登录信息：**
- 邮箱: `admin@example.com`
- 密码: `admin123`

### 5. 启动服务

开发模式（热重载）：
```bash
npm run dev
```

生产模式：
```bash
npm start
```

服务将运行在 `http://localhost:8080`

## API 文档

### 🚀 自动生成 Swagger 文档

本项目使用 `swagger-autogen` **自动生成** API 文档，无需手写注释！

#### 生成文档
```bash
npm run swagger
```

#### 访问文档
访问 **http://localhost:8080/api-docs** 查看完整的 API 文档。

Swagger UI 提供：
- 📖 完整的接口文档（自动生成）
- 🧪 在线测试功能
- 📝 请求/响应示例
- 🔍 数据模型定义

#### 工作流程
1. 修改或添加接口
2. 运行 `npm run swagger` 自动生成文档
3. 刷新浏览器查看更新

详细说明请查看：
- [SWAGGER.md](./SWAGGER.md) - 完整文档说明
- [快速开始.md](./快速开始.md) - 快速上手指南

## API 接口

### 用户管理
- POST `/manage/sys/user/getUserList` - 获取用户列表
- POST `/manage/sys/user/addUser` - 添加用户
- POST `/manage/sys/user/editUser` - 编辑用户
- POST `/manage/sys/user/deleteUser` - 删除用户
- POST `/manage/sys/user/changeUserStatus` - 修改用户状态

### 角色管理
- POST `/manage/sys/role/getRoleAdminList` - 获取角色列表
- POST `/manage/sys/role/addRole` - 添加角色
- POST `/manage/sys/role/editRole` - 编辑角色
- POST `/manage/sys/role/deleteRole` - 删除角色
- POST `/manage/sys/role/getRoleUserList` - 获取角色用户列表
- POST `/manage/sys/role/UpdateRoleUserList` - 更新角色用户

### 菜单管理
- POST `/manage/sys/menu/getMenuTree` - 获取菜单树
- POST `/manage/sys/menu/addMenuTree` - 添加菜单
- POST `/manage/sys/menu/editMenuTree` - 编辑菜单
- POST `/manage/sys/menu/deleteMenuById` - 删除菜单

### 权限管理
- POST `/manage/sys/auth/getMenuTreeWithRole` - 获取角色菜单权限
- POST `/manage/sys/auth/getMenuTreeWithUser` - 获取用户菜单权限
- POST `/manage/sys/auth/saveRoleMenu` - 保存角色菜单权限

## 项目结构

```
server/
├── src/
│   ├── models/          # 数据模型
│   │   ├── User.js
│   │   ├── Role.js
│   │   └── Menu.js
│   ├── routes/          # 路由
│   │   ├── user.js
│   │   ├── role.js
│   │   ├── menu.js
│   │   └── auth.js
│   ├── index.js         # 入口文件
│   └── init-data.js     # 数据初始化脚本
├── .env                 # 环境变量
├── package.json
└── README.md
```
