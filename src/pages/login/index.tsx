import {
  LoginFormPage,
  ProConfigProvider,
  ProFormText,
} from "@ant-design/pro-components";
import logo from "@/assets/logo.png";
import { Tabs, message as antdMessage } from "antd";
import { useDeviceWidth } from "@/hooks";
import { useState, useCallback } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import Apis from "@/apis";
import storage from "@/utils/storage";

const Page = () => {
  const { isSmallDevice } = useDeviceWidth();
  const [loading, setLoading] = useState(false);

  type LoginType = "account";
  const [loginType, setLoginType] = useState<LoginType>("account");

  const handleSubmit = useCallback(
    async (values: { username: string; password: string }) => {
      try {
        setLoading(true);

        // 调用登录接口
        // 注意：request工具会自动解包响应，直接返回data部分
        const userData = (await Apis.system.login({
          username: values.username,
          password: values.password,
        })) as any;

        console.log("登录响应(已解包):", userData);

        // 存储用户信息和token
        storage.set("userInfo", userData);
        storage.set("token", `token-${Date.now()}`);

        console.log("登录成功，用户信息已存储");

        antdMessage.success("登录成功，正在跳转...");

        // 跳转到首页（菜单会在 BasicLayout 中自动获取）
        setTimeout(() => {
          console.log("开始跳转到首页...");
          window.location.href = "/";
        }, 800);
      } catch (error: any) {
        console.error("登录失败:", error);
        antdMessage.error(error?.message || "登录失败，请检查网络连接");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const onFinish = useCallback(
    async (values: { username: string; password: string }) => {
      await handleSubmit(values);
    },
    [handleSubmit]
  );

  return (
    <div
      style={{
        backgroundColor: "white",
        height: "100vh",
      }}
      id="md-login-page"
    >
      <LoginFormPage
        logo={logo}
        {...(!isSmallDevice
          ? {
            backgroundVideoUrl:
              "https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr",
          }
          : {})}
        title="Manxiang"
        containerStyle={{
          backgroundColor: "rgba(0, 0, 0,0.25)",
          color: "rgba(0, 0, 0,0.25)",
          backdropFilter: "blur(4px)",
        }}
        subTitle="慢慢生活-慢慢想象"
        onFinish={onFinish}
        submitter={{
          searchConfig: {
            submitText: "登录",
          },
          submitButtonProps: {
            loading: loading,
            size: "large",
            style: {
              width: "100%",
            },
          },
        }}
      >
        <Tabs
          centered
          activeKey={loginType}
          onChange={(activeKey) => setLoginType(activeKey as LoginType)}
        >
          <Tabs.TabPane key={"account"} tab={"账号密码登录"} />
        </Tabs>
        {loginType === "account" && (
          <>
            <ProFormText
              name="username"
              label="用户名"
              placeholder="请输入用户名"
              fieldProps={{
                size: "large",
                prefix: <UserOutlined className="prefixIcon" />,
              }}
              rules={[
                {
                  required: true,
                  message: "请输入用户名!",
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              label="密码"
              placeholder="请输入密码"
              fieldProps={{
                size: "large",
                prefix: <LockOutlined className="prefixIcon" />,
              }}
              rules={[
                {
                  required: true,
                  message: "请输入密码！",
                },
              ]}
            />
          </>
        )}
        <div style={{ marginTop: 16, color: "#999", fontSize: 12 }}>
          <div>测试账号：</div>
          <div>超级管理员 - 用户名: admin 密码: admin123</div>
          <div>管理员 - 用户名: manager 密码: admin123</div>
        </div>
      </LoginFormPage>
    </div>
  );
};

const Login: React.FC = () => {
  return (
    <ProConfigProvider dark>
      <Page />
    </ProConfigProvider>
  );
};

export default Login;
