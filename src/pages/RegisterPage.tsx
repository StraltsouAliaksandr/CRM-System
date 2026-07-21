import { Button, Flex, Form, Input, Typography, message } from 'antd';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearAuthError, signUp } from '../store/authSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { RegistrationFormValues } from '../types/auth';
import styles from './AuthPages.module.css';

const usernamePattern = /^[A-Za-zА-Яа-яЁё]+$/;
const loginPattern = /^[A-Za-z]+$/;
const phonePattern = /^\+?[0-9]{10,15}$/;
const usernameMinLength = 1;
const usernameMaxLength = 60;
const loginMinLength = 2;
const loginMaxLength = 60;
const passwordMinLength = 6;
const passwordMaxLength = 60;

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authError = useAppSelector((state) => state.auth.authError);
  const [form] = Form.useForm<RegistrationFormValues>();

  useEffect(() => {
    if (authError) {
      message.error(authError);
      dispatch(clearAuthError());
    }
  }, [authError, dispatch]);

  const handleFinish = async (values: RegistrationFormValues): Promise<void> => {
    try {
      await dispatch(signUp(values)).unwrap();
      message.success('Регистрация прошла успешно. Теперь можно войти.');
      navigate('/login', { replace: true });
    } catch {
      return;
    }
  };

  return (
    <Flex className={styles.authPageStack} vertical gap={16}>
      <div className={styles.authIntroBlock}>
        <Typography.Title level={2}>Создайте аккаунт</Typography.Title>
        <Typography.Text type="secondary">
          Зарегистрируйтесь, чтобы сразу приступить к работе с задачами.
        </Typography.Text>
      </div>

      <Form className={styles.authForm} form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Имя"
          name="username"
          rules={[
            { required: true, message: 'Введите имя' },
            {
              min: usernameMinLength,
              max: usernameMaxLength,
              message: `Имя должно содержать от ${usernameMinLength} до ${usernameMaxLength} символов`,
            },
            {
              pattern: usernamePattern,
              message: 'Имя должно содержать только русские или латинские буквы',
            },
          ]}
        >
          <Input placeholder="Введите имя" />
        </Form.Item>

        <Form.Item
          label="Логин"
          name="login"
          rules={[
            { required: true, message: 'Введите логин' },
            {
              min: loginMinLength,
              max: loginMaxLength,
              message: `Логин должен содержать от ${loginMinLength} до ${loginMaxLength} символов`,
            },
            {
              pattern: loginPattern,
              message: 'Логин должен содержать только латинские буквы',
            },
          ]}
        >
          <Input placeholder="Введите логин" />
        </Form.Item>

        <Form.Item
          label="Почта"
          name="email"
          rules={[
            { required: true, message: 'Введите email' },
            { type: 'email', message: 'Введите корректный email' },
          ]}
        >
          <Input placeholder="mail@abc.com" />
        </Form.Item>

        <Form.Item
          label="Телефон"
          name="phoneNumber"
          rules={[
            {
              pattern: phonePattern,
              message: 'Введите корректный номер телефона',
            },
          ]}
        >
          <Input placeholder="+375..." />
        </Form.Item>

        <Form.Item
          label="Пароль"
          name="password"
          rules={[
            { required: true, message: 'Введите пароль' },
            {
              min: passwordMinLength,
              max: passwordMaxLength,
              message: `Пароль должен содержать от ${passwordMinLength} до ${passwordMaxLength} символов`,
            },
          ]}
        >
          <Input.Password placeholder="Введите пароль" />
        </Form.Item>

        <Form.Item
          label="Повторите пароль"
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
          <Button type="primary" htmlType="submit" block>
            Зарегистрироваться
          </Button>
        </Form.Item>
      </Form>

      <Flex justify="center" style={{ width: '100%', marginTop: 'auto' }}>
        <Typography.Text type="secondary">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </Typography.Text>
      </Flex>
    </Flex>
  );
}
