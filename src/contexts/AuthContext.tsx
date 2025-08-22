import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { authService, User } from "@/services/AuthService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        console.log("Initializing auth...");
        const currentUser = authService.getCurrentUser();
        const isAuth = authService.isAuthenticated();

        console.log("Current user:", currentUser);
        console.log("Is authenticated:", isAuth);

        if (currentUser && isAuth) {
          setUser(currentUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for storage changes (multi-tab logout)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "accessToken" && !e.newValue) {
        console.log("Token removed in another tab, logging out");
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = async (credentials: any) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      setUser({
        names: response.names,
        email: response.email,
        username: response.username,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
