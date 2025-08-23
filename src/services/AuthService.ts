import { httpClient } from "@/services/httpClient";
import { toast } from "react-toastify";
import { environment } from "@/environment/environment";
import { isTokenExpired, cleanupTokenStorage } from "@/utils/tokenUtils";
import axios from "axios";

export interface User {
  names: string;
  email: string;
  username: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  names: string;
  email: string;
  username: string;
  accessToken: string;
  refreshToken: string;
}

class AuthService {
  private readonly ACCESS_TOKEN_KEY = "accessToken";
  private readonly REFRESH_TOKEN_KEY = "refreshToken";
  private readonly USER_DATA_KEY = "userData";

  // Initialize and clean up old storage
  constructor() {
    cleanupTokenStorage();
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Clear any existing tokens first
      this.clearAllTokens();

      const response = await httpClient.post<AuthResponse>(
        "/auth/login",
        credentials
      );

      this.setTokens(response.accessToken, response.refreshToken);
      this.setUserData({
        names: response.names,
        email: response.email,
        username: response.username,
      });

      toast.success("Login successful!");
      return response;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  // Simplified authentication check
  isAuthenticated(): boolean {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();

    // If no tokens, not authenticated
    if (!accessToken || !refreshToken) {
      console.log("No tokens found");
      return false;
    }

    // If refresh token is expired, force logout
    if (isTokenExpired(refreshToken)) {
      console.log("Refresh token expired, forcing logout");
      this.forceLogout("Your session has expired. Please login again.");
      return false;
    }

    // If access token is expired but refresh is valid, we're still "authenticated"
    // The HTTP interceptor will handle the refresh
    return true;
  }

  async refreshToken(): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      if (isTokenExpired(refreshToken)) {
        throw new Error("Refresh token expired");
      }

      console.log("Making refresh token request...");
      // Use axios directly to avoid interceptor loop
      const response = await axios.post(
        `${environment.API}/auth/refresh`,
        { refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { accessToken, refreshToken: newRefreshToken } = response.data;
      console.log("Refresh token response received");

      this.setTokens(accessToken, newRefreshToken);
      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error: any) {
      console.error("Token refresh failed:", error);
      this.forceLogout("Your session has expired. Please login again.");
      throw new Error("Session expired. Please login again.");
    }
  }

  forceLogout(message?: string): void {
    console.log("Force logout called:", message);
    this.clearAllTokens();

    if (message) {
      toast.warning(message);
    }

    // Immediate redirect
    window.location.href = "/login";
  }

  logout(): void {
    this.clearAllTokens();
    toast.info("Logged out successfully");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  }

  getCurrentUser(): User | null {
    const userData = localStorage.getItem(this.USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  private setUserData(userData: User): void {
    localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
  }

  private clearAllTokens(): void {
    // Clear new tokens
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_DATA_KEY);

    // Clear old token key too
    localStorage.removeItem("token");
    localStorage.removeItem("names");
    localStorage.removeItem("email");
  }

  clearTokens(): void {
    this.clearAllTokens();
  }

  clearUserData(): void {
    localStorage.removeItem(this.USER_DATA_KEY);
    localStorage.removeItem("names");
    localStorage.removeItem("email");
  }
}

export const authService = new AuthService();
