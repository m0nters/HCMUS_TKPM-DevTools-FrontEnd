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

  const logoutUser = async () => {
    navigate("/");

    // without this, the DOM will re-render to fast, before it can navigate,
    // this may look like shit code, but this is the shortest solution for
    // logging out issue, increase the timeout if there's bug in future.
    await new Promise((resolve) => setTimeout(resolve, 100));

    logout();
    setUser(null);
    setIsAuth(false);
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
