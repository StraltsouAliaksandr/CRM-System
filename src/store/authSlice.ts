import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { tokenManager } from '../auth/accessTokenManager';
import {
  getApiErrorMessage,
  logoutRequest,
  refreshTokenRequest,
  signInRequest,
  signUpRequest,
} from '../api/auth';
import { getProfileRequest } from '../api/profile';
import type { AuthData, Profile, RegistrationFormValues } from '../types/auth';

interface AuthState {
  user: Profile | null;
  isInitializing: boolean;
  isAuthenticated: boolean;
  authError: string | null;
}

const initialState: AuthState = {
  user: null,
  isInitializing: true,
  isAuthenticated: false,
  authError: null,
};

export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    const refreshToken = tokenManager.getRefreshToken();

    if (!refreshToken) {
      tokenManager.clearAccessToken();
      return null;
    }

    try {
      const tokens = await refreshTokenRequest(refreshToken);
      tokenManager.setRefreshToken(tokens.refreshToken);
      tokenManager.setAccessToken(tokens.accessToken);

      const profile = await getProfileRequest(tokens.accessToken);

      return {
        user: profile,
      };
    } catch {
      tokenManager.clearTokens();

      return rejectWithValue('Сессия истекла. Выполните вход повторно.');
    }
  }
);

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (payload: AuthData, { rejectWithValue }) => {
    try {
      const tokens = await signInRequest(payload);
      tokenManager.setRefreshToken(tokens.refreshToken);
      tokenManager.setAccessToken(tokens.accessToken);

      const profile = await getProfileRequest(tokens.accessToken);

      return {
        user: profile,
      };
    } catch (error) {
      tokenManager.clearAccessToken();

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
    tokenManager.clearTokens();
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthState(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.authError = null;
      state.isInitializing = false;
      tokenManager.clearTokens();
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
          state.user = null;
          state.isAuthenticated = false;
          return;
        }

        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.isInitializing = false;
        state.user = null;
        state.isAuthenticated = false;
        state.authError = (action.payload as string) ?? null;
      })
      .addCase(signIn.pending, (state) => {
        state.authError = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
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
        state.authError = (action.payload as string) ?? 'Не удалось зарегистрировать пользователя.';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.authError = null;
      })
      .addCase(logout.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.authError = null;
      });
  },
});

export const { clearAuthError, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
