import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { environment } from "../environment/environment";
const API_BASE_URL = environment.API;

class HttpClient {
  private instance: AxiosInstance;
  private token: string | null;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.token = localStorage.getItem("token");

    // Add request interceptor to inject token
    this.instance.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
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

  // TODO: Implement token refresh logic
  // private async refreshToken(): Promise<void> {
  //   // Implementation for refreshing token
  // }

  public updateToken(token: string): void {
    this.token = token;
    localStorage.setItem("token", token);
  }

  public clearToken(): void {
    this.token = null;
    localStorage.removeItem("token");
  }
}

export const httpClient = new HttpClient();
