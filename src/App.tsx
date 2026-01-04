import { BrowserRouter } from "react-router-dom";
import { ConfigProvider, App as AntdApp } from "antd";
import zhCH from "antd/locale/zh_CN";
import Router from "@/routes";
import { useEffect } from "react";
import { setMessageInstance } from "@/utils/message";

function AppContent() {
  const { message } = AntdApp.useApp();

  useEffect(() => {
    setMessageInstance(message);
  }, [message]);

  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}

function App() {
  return (
    <ConfigProvider locale={zhCH}>
      <AntdApp>
        <AppContent />
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
