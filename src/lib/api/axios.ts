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

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

const MUTATION_METHODS = ["POST", "PUT", "PATCH", "DELETE"];

export const createApiClient = (config: ApiConfig): AxiosInstance => {
  const instance = axios.create({
    ...config,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const method = config.method?.toUpperCase();

      if (method && MUTATION_METHODS.includes(method)) {
        if (config.url?.includes("/authorization/access-token")) {
          const csrfRefreshToken = CookieUtils.getCsrfRefreshToken();
          if (csrfRefreshToken && config.headers) {
            config.headers["X-CSRF-Token"] = csrfRefreshToken;
          }
        } else {
          const csrfAccessToken = CookieUtils.getCsrfAccessToken();
          if (csrfAccessToken && config.headers) {
            config.headers["X-CSRF-Token"] = csrfAccessToken;
          }
        }
      }

      return config;
    },
    (error: AxiosError) => Promise.reject(error),
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (originalRequest.url?.includes("/authorization/access-token")) {
          CookieUtils.clearAuthCookies();
          window.location.href = "/signin";
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return instance(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          await instance.put("/api/v1/authorization/access-token");
          processQueue(null);
          return instance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError as Error);
          CookieUtils.clearAuthCookies();
          window.location.href = "/signin";
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      if (error.response?.status === 403) {
        if (!originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await instance.put("/api/v1/authorization/access-token");
            return instance(originalRequest);
          } catch (refreshError) {
            CookieUtils.clearAuthCookies();
            window.location.href = "/signin";
            return Promise.reject(refreshError);
          }
        }
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
