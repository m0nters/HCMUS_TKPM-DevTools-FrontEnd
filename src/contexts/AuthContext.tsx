import { createContext, useState, useEffect, ReactNode } from "react";
import {
  UserInfo,
  getUserInfo,
  isAuthenticated,
  logout,
} from "../services/authService";

type AuthUser = Omit<UserInfo, "token">;

interface AuthContextType {
  user: AuthUser | null;
  isAuth: boolean;
  isPremium: boolean;
  isAdmin: boolean;
  login: (user: UserInfo, rememberMe: boolean) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuth: false,
  isPremium: false,
  isAdmin: false,
  login: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Check if user is authenticated on load
    const authenticated = isAuthenticated();

    if (authenticated) {
      const userInfo = getUserInfo();
      if (userInfo) {
        setUser(userInfo);
        setIsAuth(true);
      }
    }
  }, []);

  const loginUser = (userInfo: UserInfo, rememberMe: boolean) => {
    // Store the auth info
    import("../services/authService").then((authService) => {
      authService.storeAuthInfo(userInfo, rememberMe);

      // Update state
      setUser({
        fullName: userInfo.fullName,
        userName: userInfo.userName,
        email: userInfo.email,
        isPremium: userInfo.isPremium || false,
        role: userInfo.role || "User",
      });
      setIsAuth(true);
    });
  };

  const logoutUser = () => {
    logout();
    setUser(null);
    setIsAuth(false);
  };

  const isPremium = user?.isPremium || false;
  const isAdmin = user?.role === "Admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth,
        isPremium,
        isAdmin,
        login: loginUser,
        logout: logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
