import { lazy } from "react";
import withLoadingComponent from "./components/withLoadingComponent";

const UserManagement = lazy(() => import("@/pages/system/user"));
const RoleManagement = lazy(() => import("@/pages/system/role"));
const MenuManagement = lazy(() => import("@/pages/system/menu"));
const AuthManagement = lazy(() => import("@/pages/system/auth"));

// 系统管理路由
export default {
  path: "system",
  title: "系统管理",
  icon: "SettingOutlined",
  code: "System",
  children: [
    {
      path: "user",
      title: "用户管理",
      code: "UserManagement",
      element: withLoadingComponent(<UserManagement />),
    },
    {
      path: "role",
      title: "角色管理",
      code: "RoleManagement",
      element: withLoadingComponent(<RoleManagement />),
    },
    {
      path: "menu",
      title: "菜单管理",
      code: "MenuManagement",
      element: withLoadingComponent(<MenuManagement />),
    },
    {
      path: "auth",
      title: "权限管理",
      code: "AuthManagement",
      element: withLoadingComponent(<AuthManagement />),
    },
  ],
};
