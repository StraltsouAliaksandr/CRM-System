import { Button, Checkbox, Flex, Form, Input, Typography, message } from 'antd';
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clearAuthError, signIn } from '../store/authSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { AuthData } from '../types/auth';
import './AuthPages.css';

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
    <Flex className="authPageStack" vertical gap={16}>
      <div>
        <Typography.Title className="authFormTitle" level={2}>
          Login to your Account
        </Typography.Title>
        <Typography.Text className="authFormSubtitle" type="secondary">
          See what is going on with your business
        </Typography.Text>
      </div>

      <Form className="authForm" form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Логин"
          name="login"
          rules={[{ required: true, message: 'Введите логин' }]}
        >
          <Input placeholder="Введите логин" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Введите пароль' }]}
        >
          <Input.Password placeholder="................" />
        </Form.Item>

        <Form.Item className="authRememberRow">
          <div className="authAuxRow">
            <Checkbox className="authRememberCheckbox">Remember Me</Checkbox>
            <span className="authForgotLink">Forgot Password?</span>
          </div>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button className="authSubmitButton" type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form.Item>
      </Form>

      <Typography.Text className="authFooterText">
        Not Registered Yet? <Link to="/register">Create an account</Link>
      </Typography.Text>
    </Flex>
  );
}
