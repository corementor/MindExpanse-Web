// src/utils/tokenUtils.ts

export const getTokenExpirationTime = (token: string): Date | null => {
  try {
    if (!token) return null;

    const payload = JSON.parse(atob(token.split(".")[1]));
    return new Date(payload.exp * 1000);
  } catch (error) {
    console.error("Error getting token expiration:", error);
    return null;
  }
};
export const isTokenExpired = (token: string): boolean => {
  try {
    if (!token) return true;

    // Decode JWT token
    const payload = JSON.parse(atob(token.split(".")[1]));
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
