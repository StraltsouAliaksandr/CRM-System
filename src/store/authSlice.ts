import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getApiErrorMessage,
  logoutRequest,
  refreshTokenRequest,
  signInRequest,
  signUpRequest,
} from '../api/auth';
import { getProfileRequest } from '../api/profile';
import type { AuthData, Profile, RegistrationFormValues } from '../types/auth';

const REFRESH_TOKEN_STORAGE_KEY = 'refreshToken';

interface AuthState {
  accessToken: string | null;
  user: Profile | null;
  isInitializing: boolean;
  isAuthenticated: boolean;
  authError: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  isInitializing: true,
  isAuthenticated: false,
  authError: null,
};

function saveRefreshToken(refreshToken: string): void {
  localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
}

function clearRefreshToken(): void {
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
}

function getStoredRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
}

export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    const refreshToken = getStoredRefreshToken();

    if (!refreshToken) {
      return null;
    }

    try {
      const tokens = await refreshTokenRequest(refreshToken);
      saveRefreshToken(tokens.refreshToken);

      const profile = await getProfileRequest(tokens.accessToken);

      return {
        accessToken: tokens.accessToken,
        user: profile,
      };
    } catch {
      clearRefreshToken();

      return rejectWithValue('Сессия истекла. Выполните вход повторно.');
    }
  }
);

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (payload: AuthData, { rejectWithValue }) => {
    try {
      const tokens = await signInRequest(payload);
      saveRefreshToken(tokens.refreshToken);

      const profile = await getProfileRequest(tokens.accessToken);

      return {
        accessToken: tokens.accessToken,
        user: profile,
      };
    } catch (error) {
      return rejectWithValue(
        getApiErrorMessage(error, 'Не удалось выполнить вход.', {
          401: 'Неверные логин или пароль.',
        })
      );
    }
  }
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (payload: RegistrationFormValues, { rejectWithValue }) => {
    try {
      await signUpRequest(payload);
    } catch (error) {
      return rejectWithValue(
        getApiErrorMessage(error, 'Не удалось зарегистрировать пользователя.', {
          409: 'Пользователь с таким логином или email уже существует.',
        })
      );
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await logoutRequest();
  } finally {
    clearRefreshToken();
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthState(state) {
      state.accessToken = null;
      state.user = null;
      state.isAuthenticated = false;
      state.authError = null;
      state.isInitializing = false;
      clearRefreshToken();
    },
    clearAuthError(state) {
      state.authError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.isInitializing = true;
        state.authError = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isInitializing = false;

        if (!action.payload) {
          state.accessToken = null;
          state.user = null;
          state.isAuthenticated = false;
          return;
        }

        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.isInitializing = false;
        state.accessToken = null;
        state.user = null;
        state.isAuthenticated = false;
        state.authError = (action.payload as string) ?? null;
      })
      .addCase(signIn.pending, (state) => {
        state.authError = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.authError = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.authError = (action.payload as string) ?? 'Не удалось выполнить вход.';
      })
      .addCase(signUp.pending, (state) => {
        state.authError = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.authError =
          (action.payload as string) ?? 'Не удалось зарегистрировать пользователя.';
      })
      .addCase(logout.fulfilled, (state) => {
        state.accessToken = null;
        state.user = null;
        state.isAuthenticated = false;
        state.authError = null;
      })
      .addCase(logout.rejected, (state) => {
        state.accessToken = null;
        state.user = null;
        state.isAuthenticated = false;
        state.authError = null;
      });
  },
});

export const { clearAuthError, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
