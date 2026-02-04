const apiBase = import.meta.env.VITE_API_URL ?? "/api/v1";

export const environment = {
  production: import.meta.env.PROD ?? false,
  API: apiBase,
  tokenWhitelist: ["/auth/login", "/auth/register"],
};
