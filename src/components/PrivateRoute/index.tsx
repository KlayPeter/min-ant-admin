import { Navigate } from "react-router-dom";
import storage from "@/utils/storage";

// react做登录拦截
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = storage.get("token");
  const isAuth = !!token;

  console.log("PrivateRoute 检查:", {
    hasToken: !!token,
    isAuth,
    token: token ? "存在" : "不存在"
  });

  if (!isAuth) {
    console.log("未登录，重定向到登录页");
    return <Navigate to="/login" replace />;
  }

  console.log("已登录，允许访问");
  return <>{children}</>;
};

export default PrivateRoute;
