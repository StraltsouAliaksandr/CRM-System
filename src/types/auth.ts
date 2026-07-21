export interface RegistrationFormValues {
  login: string;
  username: string;
  password: string;
  repeatPassword: string;
  email: string;
  phoneNumber: string;
}

export interface UserRegistration {
  login: string;
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
}

export interface AuthData {
  login: string;
  password: string;
}

export interface Token {
  accessToken: string;
  refreshToken: string;
}

export interface Profile {
  id: number;
  username: string;
  email: string;
  date: string;
  isBlocked: boolean;
  roles: Array<'ADMIN' | 'USER' | 'MODERATOR'>;
  phoneNumber: string;
}

export interface AuthErrorResponse {
  message?: string;
}
