import { Navigate } from "react-router-dom";

// react做登录拦截
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuth = !!localStorage.getItem("token"); // 判断是否有登录凭证
  return isAuth ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
