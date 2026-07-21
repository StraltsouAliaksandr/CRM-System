import { Button, Checkbox, Flex, Form, Input, Typography, message } from 'antd';
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clearAuthError, signIn } from '../store/authSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { AuthData } from '../types/auth';
import styles from './AuthPages.module.css';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const authError = useAppSelector((state) => state.auth.authError);
  const [form] = Form.useForm<AuthData>();

  useEffect(() => {
    if (authError) {
      message.error(authError);
      dispatch(clearAuthError());
    }
  }, [authError, dispatch]);

  const handleFinish = async (values: AuthData): Promise<void> => {
    try {
      await dispatch(signIn(values)).unwrap();
      const from = location.state?.from;
      navigate(from || '/todos', { replace: true });
    } catch {
      return;
    }
  };

  return (
    <Flex className={styles.authPageStack} vertical gap={16}>
      <div className={styles.authIntroBlock}>
        <Typography.Title level={2}>Вход в аккаунт</Typography.Title>
        <Typography.Text type="secondary">Войдите, чтобы продолжить работу</Typography.Text>
      </div>

      <Form className={styles.authForm} form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Логин"
          name="login"
          rules={[{ required: true, message: 'Введите логин' }]}
        >
          <Input placeholder="Введите логин" />
        </Form.Item>

        <Form.Item
          label="Пароль"
          name="password"
          rules={[{ required: true, message: 'Введите пароль' }]}
        >
          <Input.Password placeholder="Введите пароль" />
        </Form.Item>

        <Form.Item>
          <Flex align="center" justify="space-between" gap={12}>
            <Checkbox>Запомнить меня</Checkbox>
            <Typography.Link>Забыли пароль?</Typography.Link>
          </Flex>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button type="primary" htmlType="submit" block>
            Войти
          </Button>
        </Form.Item>
      </Form>

      <Flex justify="center" style={{ width: '100%', marginTop: 'auto' }}>
        <Typography.Text type="secondary">
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </Typography.Text>
      </Flex>
    </Flex>
  );
}
