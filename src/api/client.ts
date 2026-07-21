import axios from 'axios';

const BASE_URL = 'https://easydev.club/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface SetupApiClientOptions {
  getAccessToken: () => string | null;
  onUnauthorized: () => void;
}

let requestInterceptorId: number | null = null;
let responseInterceptorId: number | null = null;

export function setupApiClient({
  getAccessToken,
  onUnauthorized,
}: SetupApiClientOptions): void {
  if (requestInterceptorId !== null) {
    apiClient.interceptors.request.eject(requestInterceptorId);
  }

  if (responseInterceptorId !== null) {
    apiClient.interceptors.response.eject(responseInterceptorId);
  }

  requestInterceptorId = apiClient.interceptors.request.use((config) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  });

  responseInterceptorId = apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error.response?.status;
      const url = error.config?.url as string | undefined;
      const isAuthRequest = url?.startsWith('/auth/');

      if (status === 401 && !isAuthRequest) {
        onUnauthorized();
      }

      return Promise.reject(error);
    }
  );
}
