import { ProLayout, ProConfigProvider } from '@ant-design/pro-components';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import * as Icons from '@ant-design/icons';
import { Dropdown, message } from 'antd';
import type { MenuDataItem } from '@ant-design/pro-components';
import logo from '@/assets/logo.png';
import storage from '@/utils/storage';
import Apis from '@/apis';

// 动态获取图标组件
const getIcon = (iconName?: string) => {
  if (!iconName) return null;
  const Icon = (Icons as any)[iconName];
  return Icon ? <Icon /> : null;
};

// 转换后端菜单数据为 ProLayout 菜单格式
const transformMenuData = (menus: any[]): MenuDataItem[] => {
  return menus
    .filter(menu => menu.type !== 3) // 过滤掉按钮类型
    .map((menu) => ({
      path: menu.path,
      name: menu.name,
      icon: getIcon(menu.icon),
      children: menu.children ? transformMenuData(menu.children) : undefined,
    }));
};

const BasicLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pathname, setPathname] = useState(location.pathname);
  const [menuData, setMenuData] = useState<MenuDataItem[]>([]);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initMenus = async () => {
      try {
        // 从 storage 获取用户信息
        const storedUserInfo = storage.get('userInfo');

        console.log('BasicLayout - 用户信息:', storedUserInfo);

        if (!storedUserInfo) {
          console.log('没有用户信息，跳转登录');
          navigate('/login', { replace: true });
          return;
        }

        setUserInfo(storedUserInfo);

        // 每次都调用接口获取最新菜单（已经是树状结构）
        console.log('调用接口获取菜单...');
        try {
          const menuTree = await Apis.system.auth.getUserFinalMenus({
            userId: storedUserInfo.id,
          }) as any;
          console.log('获取到的菜单树:', menuTree);

          if (menuTree && Array.isArray(menuTree)) {
            // 直接转换为 ProLayout 格式（接口已返回树状结构）
            const transformedMenus = transformMenuData(menuTree);
            console.log('BasicLayout - 转换后的菜单:', transformedMenus);
            setMenuData(transformedMenus);
          }
        } catch (error: any) {
          console.error('获取菜单失败:', error);
          message.error('获取菜单失败: ' + (error?.message || '未知错误'));
        }
      } catch (error) {
        console.error('初始化菜单失败:', error);
      } finally {
        setLoading(false);
      }
    };

    initMenus();
  }, [navigate]);

  const handleLogout = () => {
    storage.remove('token');
    storage.remove('userInfo');
    navigate('/login', { replace: true });
  };

  return (
    <ProConfigProvider hashed={false}>
      <ProLayout
        title="Min Ant Admin"
        logo={logo}
        layout="mix"
        splitMenus={false}
        loading={loading}
        location={{ pathname }}
        route={{
          path: '/',
          routes: menuData,
        }}
        avatarProps={{
          src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
          size: 'small',
          title: userInfo?.nickname || userInfo?.username || '管理员',
          render: (_, dom) => {
            return (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'userInfo',
                      label: (
                        <div>
                          <div>用户名: {userInfo?.username}</div>
                          <div>昵称: {userInfo?.nickname}</div>
                        </div>
                      ),
                      disabled: true,
                    },
                    {
                      type: 'divider',
                    },
                    {
                      key: 'logout',
                      icon: <Icons.LogoutOutlined />,
                      label: '退出登录',
                      onClick: handleLogout,
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
