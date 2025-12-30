import {
  LoginFormPage,
  ProConfigProvider,
  ProFormText,
} from "@ant-design/pro-components";
import logo from "@/assets/logo.png";
import { Tabs, message } from "antd";
import { useDeviceWidth } from "@/hooks";
import { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useCallback } from "react";
import md5 from "blueimp-md5-es6/js/md5";
const Page = () => {
  const { isSmallDevice } = useDeviceWidth();
  type LoginType = "account";
  const [loginType, setLoginType] = useState<LoginType>("account");

  const handleSubmit = useCallback(
    async (values: { username: string; password: string }) => {
      try {
        // 登录逻辑
        const requestBody = {
          username: values.username,
          password: md5(values.password), // 使用md5加密密码
        };

        // 使用本地模拟登录提交
        const validUser = "mmx";
        const validPassword = md5("123456");

        if (
          requestBody.username === validUser &&
          requestBody.password === validPassword
        ) {
          // 模拟 token
          const fakeToken = "fake-jwt-token-" + Date.now();

          // 存储 token 和用户名
          localStorage.setItem("token", fakeToken);
          localStorage.setItem("username", requestBody.username);

          message.success("登录成功");
          window.location.href = "/"; // 跳转首页
        } else {
          message.error("账号或密码错误");
        }
      } catch (error) {}
    },
    []
  );
  const onFinish = useCallback(
    async (values: { username: string; password: string }) => {
      await handleSubmit(values);
      message.success("登录成功");
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
            <ProFormText
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
