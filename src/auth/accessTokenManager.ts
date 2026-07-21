const REFRESH_TOKEN_STORAGE_KEY = 'refreshToken';

class TokenManager {
  static #instance: TokenManager | null = null;
  #accessToken: string | null = null;

  private constructor() {}

  static getInstance(): TokenManager {
    if (!TokenManager.#instance) {
      TokenManager.#instance = new TokenManager();
    }

    return TokenManager.#instance;
  }

  getAccessToken(): string | null {
    return this.#accessToken;
  }

  setAccessToken(accessToken: string): void {
    this.#accessToken = accessToken;
  }

  clearAccessToken(): void {
    this.#accessToken = null;
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
  }

  setRefreshToken(refreshToken: string): void {
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
  }

  clearRefreshToken(): void {
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  }

  clearTokens(): void {
    this.clearAccessToken();
    this.clearRefreshToken();
  }
}

export const tokenManager = TokenManager.getInstance();
