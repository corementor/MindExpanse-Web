// src/utils/tokenUtils.ts

const decodeToken = (token: string): Record<string, unknown> | null => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const jsonPayload = decodeURIComponent(
      decoded
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const getTokenExpirationTime = (token: string): Date | null => {
  try {
    if (!token) return null;

    const payload = decodeToken(token);
    if (!payload || typeof payload.exp !== "number") return null;
    return new Date(payload.exp * 1000);
  } catch (error) {
    console.error("Error getting token expiration:", error);
    return null;
  }
};
export const isTokenExpired = (token: string): boolean => {
  try {
    if (!token) return true;

    const payload = decodeToken(token);
    if (!payload || typeof payload.exp !== "number") return true;
    const currentTime = Date.now() / 1000;

    // Check if token is expired (with 30 second buffer)
    return payload.exp < currentTime + 30;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true;
  }
};

// Clean up old token storage
export const cleanupTokenStorage = () => {
  // Remove old token key
  localStorage.removeItem("token");
  // Remove new token keys if invalid
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (accessToken && isTokenExpired(accessToken)) {
    if (!refreshToken || isTokenExpired(refreshToken)) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userData");
      return true; // Tokens were cleaned up
    }
  }
  return false;
};
