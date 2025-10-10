const COOKIE_NAMES = {
  ACCESS_TOKEN: "access_token_cookie",
  REFRESH_TOKEN: "refresh_token_cookie",
  CSRF_ACCESS: "csrf_access_token",
  CSRF_REFRESH: "csrf_refresh_token",
} as const;

export class CookieUtils {
  /**
   * Get a specific cookie value by name
   * @param name - The name of the cookie
   * @returns The cookie value or null if not found
   */
  static getCookie(name: string): string | null {
    const cookies = this.parseCookies(document.cookie);
    return cookies[name] ?? null;
  }

  /**
   * Get the CSRF access token for mutation requests
   * This token is NOT httpOnly and can be read by JavaScript
   * @returns The CSRF access token or null
   */
  static getCsrfAccessToken(): string | null {
    return this.getCookie(COOKIE_NAMES.CSRF_ACCESS);
  }

  /**
   * Get the CSRF refresh token for refresh endpoint
   * This token is NOT httpOnly and can be read by JavaScript
   * @returns The CSRF refresh token or null
   */
  static getCsrfRefreshToken(): string | null {
    return this.getCookie(COOKIE_NAMES.CSRF_REFRESH);
  }

  /**
   * Check if user appears to be authenticated
   * We check for the presence of CSRF tokens since httpOnly tokens
   * are not accessible to JavaScript
   * @returns true if CSRF access token exists
   */
  static isAuthenticated(): boolean {
    return !!this.getCsrfAccessToken();
  }

  /**
   * Clear authentication state
   * We can't delete httpOnly cookies from JavaScript,
   * but we can trigger a logout endpoint that will clear them
   */
  static clearAuthCookies(): void {
    const domain = window.location.hostname;
    document.cookie = `${COOKIE_NAMES.CSRF_ACCESS}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`;
    document.cookie = `${COOKIE_NAMES.CSRF_REFRESH}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`;
  }

  /**
   * Parse a cookie string into an object
   * @param cookieString - The raw cookie string from document.cookie
   * @returns Object with cookie key-value pairs
   */
  private static parseCookies(cookieString: string): Record<string, string> {
    return cookieString
      .split(";")
      .map((cookie) => cookie.trim().split("="))
      .reduce(
        (acc, [key, value]) => {
          if (key && value) {
            acc[key] = decodeURIComponent(value);
          }
          return acc;
        },
        {} as Record<string, string>,
      );
  }
}
