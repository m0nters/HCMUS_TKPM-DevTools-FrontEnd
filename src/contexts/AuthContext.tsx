import { createContext, useState, useEffect, ReactNode } from "react";
import { getUserInfo, storeAuthInfo, logout } from "../services/authService";
import { UserInfo } from "../types/auth";
import { AuthUser, AuthContextType } from "../types/authContext";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuth: false,
  isPremium: false,
  isAdmin: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo) {
      setUser(userInfo);
      setIsAuth(true);
    }
    setIsLoading(false);
  }, []);

  const loginUser = (userInfo: UserInfo, rememberMe: boolean) => {
    // Store the auth info
    storeAuthInfo(userInfo, rememberMe);

    // Update state
    setUser({
      fullName: userInfo.fullName,
      userName: userInfo.userName,
      email: userInfo.email,
      role: userInfo.role || "User",
    });
    setIsAuth(true);
  };

  const logoutUser = () => {
    setIsLoading(true); // otherwise you can't navigate back to home since this will be obscured by those navigations in `ProtectedRoutes`
    logout();
    setUser(null);
    setIsAuth(false);
    navigate("/");
  };

  const isPremium = user?.role === "Premium" || user?.role === "Admin";
  const isAdmin = user?.role === "Admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth,
        isPremium,
        isAdmin,
        isLoading,
        login: loginUser,
        logout: logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
