import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import zhCH from "antd/locale/zh_CN";
import Router from "@/routes";

function App() {
  return (
    <ConfigProvider locale={zhCH}>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
