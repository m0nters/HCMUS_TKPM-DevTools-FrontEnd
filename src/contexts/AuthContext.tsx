import { createContext, useState, useEffect, ReactNode, useRef } from "react";
import {
  getUserInfo,
  storeAuthInfo,
  clearUserSession,
  getTokenExpiration,
} from "../services/";
import { UserInfo } from "../types/";
import { useNavigate } from "react-router-dom";

type AuthUser = Omit<UserInfo, "token">;

interface AuthContextType {
  user: AuthUser | null;
  isAuth: boolean;
  isPremium: boolean;
  isAdmin: boolean;
  isLoading: boolean; // for waiting to completely load state's data for protected routes
  login: (user: UserInfo, rememberMe: boolean) => void;
  logout: (
    redirectPath?: string,
    message?: { message: string; isError: boolean; isPersistent?: boolean },
  ) => void;
}

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
  const expirationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check token and set up expiration handling
  const setupTokenExpirationMonitoring = () => {
    // Clear any existing timer
    if (expirationTimerRef.current) {
      clearTimeout(expirationTimerRef.current);
      expirationTimerRef.current = null;
    }

    // Get token expiration time
    const expiresAt = getTokenExpiration();
    if (!expiresAt) return;

    // Calculate time until expiration (in milliseconds)
    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiration = Math.max((expiresAt - currentTime) * 1000, 0);
    if (timeUntilExpiration / 1000 < 60) {
      console.log(
        "Token expires in:",
        Math.floor(timeUntilExpiration / 1000),
        "seconds",
      );
    } else {
      console.log(
        "Token expires in:",
        Math.floor(timeUntilExpiration / 1000 / 60),
        "minutes",
      );
    }
    // Set timer to logout when token expires
    expirationTimerRef.current = setTimeout(() => {
      handleTokenExpiration();
    }, timeUntilExpiration);
  };

  // Handle token expiration
  const handleTokenExpiration = () => {
    logoutUser("/login", {
      message: "Your session has expired. Please log in again.",
      isError: true,
      isPersistent: true,
    });
  };

  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo) {
      setUser(userInfo);
      setIsAuth(true);
      // Set up expiration monitoring when a user is loaded
      setupTokenExpirationMonitoring();
    }
    setIsLoading(false);

    // Cleanup function to clear the timer when component unmounts
    return () => {
      if (expirationTimerRef.current) {
        clearTimeout(expirationTimerRef.current);
      }
    };
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

    // Set up expiration monitoring when user logs in
    setupTokenExpirationMonitoring();
  };

  // Default behavior: redirect to home page without message
  const logoutUser = async (
    redirectPath: string = "/",
    message?: {
      message: string;
      isError: boolean;
      isPersistent?: boolean;
    },
  ) => {
    // Clear any expiration timer
    if (expirationTimerRef.current) {
      clearTimeout(expirationTimerRef.current);
      expirationTimerRef.current = null;
    }

    // First clear the user session and update state
    clearUserSession();
    setUser(null);
    setIsAuth(false);

    // without this, the DOM will re-render to fast, before it can navigate,
    // this may look like shit code, but this is the shortest solution for
    // logging out issue, increase the timeout if there's bug in future.
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Navigate last, after all state updates
    navigate(redirectPath, {
      // Only include state if a message is provided
      ...(message && { state: message }),
      // Use replace to prevent back navigation to unauthorized pages
      replace: true,
    });
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
