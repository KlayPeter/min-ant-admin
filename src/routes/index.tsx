import PrivateRoute from "@/components/PrivateRoute";
import { withLoadingComponent } from "./components";
import Login from "@/pages/login";
import BasicLayout from "@/layout/BasicLayout";
import Dashboard from "@/pages/dashboard";
import Error from "@/pages/error";
import system from "./system";
import { useRoutes } from "react-router-dom";

export const businessRoutes = [
  {
    path: "/",
    title: "首页",
    icon: "HomeOutlined",
    element: withLoadingComponent(<Dashboard />),
  },
  system,
  {
    path: '*',
    title: '页面找不到',
    element: <Error />,
  },
];

const routers = [
  {
    path: "/",
    element: (
      <PrivateRoute>
        <BasicLayout />
      </PrivateRoute>
    ),
    children: [...businessRoutes],
  },
  {
    path: "/login",
    title: "登陆",
    element: withLoadingComponent(<Login />),
  },
];

const Router = () => {
  return useRoutes(routers);
};

export default Router;
