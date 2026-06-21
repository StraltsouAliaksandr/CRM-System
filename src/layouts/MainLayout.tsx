import { LogoutOutlined, UnorderedListOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import { useAppDispatch } from '../store/hooks';
import '../App.css';

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const menuItems: MenuProps['items'] = [
    {
      key: '/todos',
      icon: <UnorderedListOutlined />,
      label: 'Список задач',
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: 'Личный кабинет',
    },
  ];

  const handleLogout = async (): Promise<void> => {
    await dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <Layout className="appLayout">
      <Layout.Sider breakpoint="lg" collapsedWidth="0">
        <div className="appLogo">
          <Typography.Title level={4} style={{ color: '#fff', margin: 0 }}>
            CRM Todos
          </Typography.Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Layout.Sider>
      <Layout>
        <Layout.Header className="appHeader">
          <Button icon={<LogoutOutlined />} onClick={() => void handleLogout()}>
            Выйти
          </Button>
        </Layout.Header>
        <Layout.Content className="appContent">
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
