import PrivateRoute from "@/components/PrivateRoute";
import { withLoadingComponent } from "./components";
import Login from "@/pages/login";
import BasicLayout from "@/layout/BasicLayout";
import Dashboard from "@/pages/dashboard";
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
