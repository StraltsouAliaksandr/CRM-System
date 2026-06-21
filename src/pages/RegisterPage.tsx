import { Button, Flex, Form, Input, Typography, message } from 'antd';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearAuthError, signUp } from '../store/authSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { RegistrationFormValues } from '../types/auth';
import './AuthPages.css';

const usernamePattern = /^[A-Za-zА-Яа-яЁё]+$/;
const loginPattern = /^[A-Za-z]+$/;
const phonePattern = /^\+?[0-9]{10,15}$/;

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authError = useAppSelector((state) => state.auth.authError);
  const [form] = Form.useForm<RegistrationFormValues>();

  useEffect(() => {
    if (authError) {
      void message.error(authError);
      dispatch(clearAuthError());
    }
  }, [authError, dispatch]);

  const handleFinish = async (values: RegistrationFormValues): Promise<void> => {
    try {
      await dispatch(signUp(values)).unwrap();
      void message.success('Регистрация прошла успешно. Теперь можно войти.');
      navigate('/login', { replace: true });
    } catch {
      return;
    }
  };

  return (
    <Flex className="authPageStack" vertical gap={16}>
      <div>
        <Typography.Title className="authFormTitle" level={2}>
          Create your Account
        </Typography.Title>
        <Typography.Text className="authFormSubtitle" type="secondary">
          Join the workspace and start managing tasks right away.
        </Typography.Text>
      </div>

      <Form className="authForm" form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Username"
          name="username"
          rules={[
            { required: true, message: 'Введите имя' },
            { min: 1, max: 60, message: 'Имя должно содержать от 1 до 60 символов' },
            {
              pattern: usernamePattern,
              message: 'Имя должно содержать только русские или латинские буквы',
            },
          ]}
        >
          <Input placeholder="Введите имя" />
        </Form.Item>

        <Form.Item
          label="Login"
          name="login"
          rules={[
            { required: true, message: 'Введите логин' },
            { min: 2, max: 60, message: 'Логин должен содержать от 2 до 60 символов' },
            {
              pattern: loginPattern,
              message: 'Логин должен содержать только латинские буквы',
            },
          ]}
        >
          <Input placeholder="Введите логин" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Введите email' },
            { type: 'email', message: 'Введите корректный email' },
          ]}
        >
          <Input placeholder="mail@abc.com" />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phoneNumber"
          rules={[
            {
              validator: async (_, value: string | undefined) => {
                if (!value || phonePattern.test(value)) {
                  return;
                }

                throw new Error('Введите корректный номер телефона');
              },
            },
          ]}
        >
          <Input placeholder="+375..." />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: 'Введите пароль' },
            { min: 6, max: 60, message: 'Пароль должен содержать от 6 до 60 символов' },
          ]}
        >
          <Input.Password placeholder="Введите пароль" />
        </Form.Item>

        <Form.Item
          label="Repeat password"
          name="repeatPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Повторите пароль' },
            ({ getFieldValue }) => ({
              validator: async (_, value: string | undefined) => {
                if (!value || getFieldValue('password') === value) {
                  return;
                }

                throw new Error('Пароли не совпадают');
              },
            }),
          ]}
        >
          <Input.Password placeholder="Повторите пароль" />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button className="authSubmitButton" type="primary" htmlType="submit" block>
            Create account
          </Button>
        </Form.Item>
      </Form>

      <Typography.Text className="authFooterText">
        Already registered? <Link to="/login">Login</Link>
      </Typography.Text>
    </Flex>
  );
}
