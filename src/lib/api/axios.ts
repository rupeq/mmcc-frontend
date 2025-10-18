import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

import { CookieUtils } from "./cookieUtils";

interface ApiConfig {
  baseURL: string;
  timeout?: number;
}

const MUTATION_METHODS = ["POST", "PUT", "PATCH", "DELETE"] as const;
const REFRESH_TOKEN_PATH = "/api/v1/authorization/access-token";
const SIGNIN_PATH = "/signin";

const redirectToSignIn = () => {
  CookieUtils.clearAuthCookies();
  window.location.href = SIGNIN_PATH;
};

const isRefreshTokenRequest = (url?: string): boolean => {
  return url?.includes(REFRESH_TOKEN_PATH) ?? false;
};

const requiresCsrfToken = (method?: string): boolean => {
  return method
    ? MUTATION_METHODS.includes(
        method.toUpperCase() as (typeof MUTATION_METHODS)[number],
      )
    : false;
};

const addCsrfToken = (config: InternalAxiosRequestConfig): void => {
  if (!requiresCsrfToken(config.method)) {
    return;
  }

  const csrfToken = isRefreshTokenRequest(config.url)
    ? CookieUtils.getCsrfRefreshToken()
    : CookieUtils.getCsrfAccessToken();

  if (csrfToken && config.headers) {
    config.headers["X-CSRF-Token"] = csrfToken;
  }
};

export const createApiClient = (config: ApiConfig): AxiosInstance => {
  const instance = axios.create({
    ...config,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  let refreshPromise: Promise<void> | null = null;

  const refreshAccessToken = async (): Promise<void> => {
    if (refreshPromise) {
      return refreshPromise;
    }

    refreshPromise = instance
      .put(REFRESH_TOKEN_PATH)
      .then(() => {
        refreshPromise = null;
      })
      .catch((error) => {
        refreshPromise = null;
        throw error;
      });

    return refreshPromise;
  };

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      addCsrfToken(config);
      return config;
    },
    (error: AxiosError) => Promise.reject(error),
  );

  const handle401Error = async (error: AxiosError): Promise<unknown> => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (originalRequest._retry) {
      if (import.meta.env.DEV) {
        console.error("Token refresh retry loop detected");
      }
      redirectToSignIn();
      return Promise.reject(error);
    }

    if (isRefreshTokenRequest(originalRequest.url)) {
      if (import.meta.env.DEV) {
        console.error("Refresh token request failed");
      }
      redirectToSignIn();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await refreshAccessToken();
      return instance(originalRequest);
    } catch (refreshError) {
      if (import.meta.env.DEV) {
        console.error("Token refresh failed:", refreshError);
      }
      redirectToSignIn();
      return Promise.reject(refreshError);
    }
  };

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        return handle401Error(error);
      }
      return Promise.reject(error);
    },
  );

  return instance;
};

export const apiClient = createApiClient({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000",
  timeout: 30000,
});

export const api = {
  get: <T = unknown>(
    url: string,
    config?: Parameters<typeof apiClient.get>[1],
  ) => apiClient.get<T>(url, config),
  post: <T = unknown>(
    url: string,
    data?: unknown,
    config?: Parameters<typeof apiClient.post>[2],
  ) => apiClient.post<T>(url, data, config),
  put: <T = unknown>(
    url: string,
    data?: unknown,
    config?: Parameters<typeof apiClient.put>[2],
  ) => apiClient.put<T>(url, data, config),
  patch: <T = unknown>(
    url: string,
    data?: unknown,
    config?: Parameters<typeof apiClient.patch>[2],
  ) => apiClient.patch<T>(url, data, config),
  delete: <T = unknown>(
    url: string,
    config?: Parameters<typeof apiClient.delete>[1],
  ) => apiClient.delete<T>(url, config),
};
