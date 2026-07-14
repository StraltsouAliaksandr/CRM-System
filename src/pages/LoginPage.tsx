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
      void message.error(authError);
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
        <Typography.Title
          level={2}
          style={{
            marginBottom: 6,
            color: '#525252',
            fontSize: 32,
            fontWeight: 700,
            lineHeight: 1.15,
          }}
        >
          Login to your Account
        </Typography.Title>
        <Typography.Text
          type="secondary"
          style={{
            display: 'block',
            marginBottom: 20,
            color: '#555555',
            fontSize: 16,
          }}
        >
          See what is going on with your business
        </Typography.Text>
      </div>

      <Form className={styles.authForm} form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Login"
          name="login"
          rules={[{ required: true, message: 'Введите логин' }]}
        >
          <Input placeholder="Login" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Введите пароль' }]}
        >
          <Input.Password placeholder="................" />
        </Form.Item>

        <Form.Item className={styles.authRememberRow}>
          <div className={styles.authAuxRow}>
            <Checkbox className={styles.authRememberCheckbox}>Remember Me</Checkbox>
            <span className={styles.authForgotLink}>Forgot Password?</span>
          </div>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button className={styles.authSubmitButton} type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form.Item>
      </Form>

      <Typography.Text className={styles.authFooterText} style={{ color: '#a1a1a1' }}>
        Not Registered Yet? <Link to="/register">Create an account</Link>
      </Typography.Text>
    </Flex>
  );
}
