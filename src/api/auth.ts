import { AxiosError } from 'axios';
import type {
  AuthData,
  AuthErrorResponse,
  RegistrationFormValues,
  Token,
  UserRegistration,
} from '../types/auth';
import { apiClient } from './client';

export async function signInRequest(payload: AuthData): Promise<Token> {
  const { data } = await apiClient.post<Token>('/auth/signin', payload);

  return data;
}

export async function signUpRequest(payload: RegistrationFormValues): Promise<void> {
  const requestBody: UserRegistration = {
    login: payload.login,
    username: payload.username,
    password: payload.password,
    email: payload.email,
    phoneNumber: payload.phoneNumber,
  };

  await apiClient.post('/auth/signup', requestBody);
}

export async function refreshTokenRequest(refreshToken: string): Promise<Token> {
  const { data } = await apiClient.post<Token>('/auth/refresh', { refreshToken });

  return data;
}

export async function logoutRequest(): Promise<void> {
  await apiClient.post('/user/logout');
}

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage: string,
  statusMessages: Partial<Record<number, string>> = {}
): string {
  if (error instanceof AxiosError) {
    const status = error.response?.status;

    if (status && statusMessages[status]) {
      return statusMessages[status] as string;
    }

    const serverMessage = error.response?.data as AuthErrorResponse | string | undefined;

    if (typeof serverMessage === 'string') {
      return serverMessage;
    }

    if (serverMessage && typeof serverMessage.message === 'string') {
      return serverMessage.message;
    }
  }

  return fallbackMessage;
}
