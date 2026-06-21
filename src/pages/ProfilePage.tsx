import { Card, Descriptions, Typography } from 'antd';
import { useAppSelector } from '../store/hooks';

export default function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <Card>
      <Typography.Title level={3}>Личный кабинет</Typography.Title>
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Имя">{user?.username || '-'}</Descriptions.Item>
        <Descriptions.Item label="Email">{user?.email || '-'}</Descriptions.Item>
        <Descriptions.Item label="Телефон">{user?.phoneNumber || '-'}</Descriptions.Item>
        <Descriptions.Item label="Роли">
          {user?.roles?.join(', ') || '-'}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}
