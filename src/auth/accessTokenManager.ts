class AccessTokenManager {
  #accessToken: string | null = null;

  get(): string | null {
    return this.#accessToken;
  }

  set(accessToken: string): void {
    this.#accessToken = accessToken;
  }

  clear(): void {
    this.#accessToken = null;
  }
}

export const accessTokenManager = new AccessTokenManager();
