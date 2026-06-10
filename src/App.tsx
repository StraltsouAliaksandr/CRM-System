import { UserOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Layout, Menu, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import TodoListPage from './pages/TodoListPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems: MenuProps['items'] = [
    {
      key: '/',
      icon: <UnorderedListOutlined />,
      label: 'Список задач',
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: 'Профиль',
    },
  ];

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
        <Layout.Content className="appContent">
          <Routes>
            <Route path="/" element={<TodoListPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
