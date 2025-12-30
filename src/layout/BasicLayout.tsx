import { ProLayout, ProConfigProvider } from '@ant-design/pro-components';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import * as Icons from '@ant-design/icons';
import { Dropdown } from 'antd';
import type { MenuDataItem } from '@ant-design/pro-components';
import { businessRoutes } from '@/routes';
import logo from '@/assets/logo.png';

// 动态获取图标组件
const getIcon = (iconName?: string) => {
  if (!iconName) return null;
  const Icon = (Icons as any)[iconName];
  return Icon ? <Icon /> : null;
};

// 转换路由配置为菜单数据
const transformRouteToMenu = (routes: any[]): MenuDataItem[] => {
  return routes.map((route) => ({
    path: route.path,
    name: route.title,
    icon: getIcon(route.icon),
    children: route.children ? transformRouteToMenu(route.children) : undefined,
  }));
};

const BasicLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pathname, setPathname] = useState(location.pathname);

  return (
    <ProConfigProvider hashed={false}>
      <ProLayout
        title="Min Ant Admin"
        logo={logo}
        layout="mix"
        splitMenus={false}
        location={{ pathname }}
        route={{
          path: '/',
          routes: transformRouteToMenu(businessRoutes),
        }}
        avatarProps={{
          src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
          size: 'small',
          title: '管理员',
          render: (_, dom) => {
            return (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'logout',
                      icon: <Icons.LogoutOutlined />,
                      label: '退出登录',
                      onClick: () => {
                        localStorage.removeItem('token');
                        navigate('/login');
                      },
                    },
                  ],
                }}
              >
                {dom}
              </Dropdown>
            );
          },
        }}
        menuItemRender={(item, dom) => (
          <div
            onClick={() => {
              const path = item.path || '/';
              setPathname(path);
              navigate(path);
            }}
          >
            {dom}
          </div>
        )}
      >
        <Outlet />
      </ProLayout>
    </ProConfigProvider>
  );
};

export default BasicLayout;
