import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { environment } from "../environment/environment";
import { authService } from "./AuthService";
import { isTokenExpired, cleanupTokenStorage } from "../utils/tokenUtils";

const API_BASE_URL = environment.API;

class HttpClient {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private failedRequests: Array<{
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
    config: AxiosRequestConfig;
  }> = [];

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Clean up any old token storage
        cleanupTokenStorage();

        // Skip auth for certain endpoints
        const authSkipUrls = ["/auth/refresh", "/auth/login", "/auth/register"];
        const shouldSkipAuth = authSkipUrls.some((url) =>
          config.url?.includes(url)
        );

        if (shouldSkipAuth) {
          return config;
        }

        const token = authService.getAccessToken();
        if (token) {
          // Check if token is expired before making request
          if (isTokenExpired(token)) {
            console.log("Access token expired, checking refresh token...");
            const refreshToken = authService.getRefreshToken();
            if (!refreshToken || isTokenExpired(refreshToken)) {
              console.log("Refresh token also expired, forcing logout");
              authService.forceLogout(
                "Your session has expired. Please login again."
              );
              return Promise.reject(new Error("Session expired"));
            }
            // Let the response interceptor handle the refresh
          }

          config.headers.Authorization = `Bearer ${token}`;
        } else {
          console.log("No access token found, redirecting to login");
          setTimeout(() => {
            window.location.href = "/login";
          }, 100);
          return Promise.reject(new Error("No authentication token"));
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - Handle both 401 AND 403 as token expiration
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle network errors
        if (!error.response) {
          console.error("Network error:", error);
          return Promise.reject(error);
        }

        const status = error.response.status;
        console.log("HTTP Error Status:", status);

        // Check if it's a 401 OR 403 error (both can indicate expired/invalid token)
        const authUrls = ["/auth/login", "/auth/register", "/auth/refresh"];
        const isAuthRequest = authUrls.some((url) =>
          originalRequest.url?.includes(url)
        );

        if (
          (status === 401 || status === 403) &&
          !isAuthRequest &&
          !originalRequest._retry
        ) {
          console.log(`Received ${status} error, attempting token refresh...`);

          // Check if refresh token exists and is valid
          const refreshToken = authService.getRefreshToken();
          if (!refreshToken || isTokenExpired(refreshToken)) {
            console.log("No valid refresh token, forcing logout");
            authService.forceLogout(
              "Your session has expired. Please login again."
            );
            return Promise.reject(error);
          }

          if (this.isRefreshing) {
            console.log(
              "Token refresh already in progress, queuing request..."
            );
            // Add request to queue if refresh is in progress
            return new Promise((resolve, reject) => {
              this.failedRequests.push({
                resolve: (token) => {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                  resolve(this.instance(originalRequest));
                },
                reject,
                config: originalRequest,
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            console.log("Attempting to refresh token...");
            const refreshResponse = await authService.refreshToken();
            const newToken = refreshResponse.accessToken;
            console.log("Token refreshed successfully!");

            // Update token in original request
            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            // Retry all failed requests with new token
            this.failedRequests.forEach((request) => {
              request.resolve(newToken);
            });
            this.failedRequests = [];

            // Retry the original request
            return this.instance(originalRequest);
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);

            // Refresh failed - reject all queued requests and force logout
            this.failedRequests.forEach((request) => {
              request.reject(refreshError);
            });
            this.failedRequests = [];

            authService.forceLogout(
              "Your session has expired. Please login again."
            );
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        // For other errors, just reject
        console.log("Non-auth error:", status, error.response?.data);
        return Promise.reject(error);
      }
    );
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  public async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }
}

export const httpClient = new HttpClient();
