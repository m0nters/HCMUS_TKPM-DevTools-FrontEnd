interface LoginCredentials {
  userName: string;
  password: string;
}

export interface UserInfo {
  fullName: string;
  userName: string;
  email: string;
  token: string;
  isPremium?: boolean;
  role?: string;
}

/**
 * Logs in a user and returns user information with JWT token
 */
export const login = async (
  credentials: LoginCredentials
): Promise<UserInfo> => {
  try {
    const response = await fetch("/api/Account/Login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to login");
    }

    const userData: UserInfo = await response.json();
    return userData;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

/**
 * Stores the authentication token and user info
 */
export const storeAuthInfo = (userInfo: UserInfo, rememberMe: boolean) => {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem("authToken", userInfo.token);
  storage.setItem(
    "userInfo",
    JSON.stringify({
      fullName: userInfo.fullName,
      userName: userInfo.userName,
      email: userInfo.email,
      isPremium: userInfo.isPremium || false,
      role: userInfo.role || "User",
    })
  );
};

/**
 * Gets the current authentication token
 */
export const getAuthToken = (): string | null => {
  // First check session storage (not remember me)
  let token = sessionStorage.getItem("authToken");

  // If not in session storage, try local storage (remember me)
  if (!token) {
    token = localStorage.getItem("authToken");
  }

  return token;
};

/**
 * Gets the current user information
 */
export const getUserInfo = (): Omit<UserInfo, "token"> | null => {
  // Check session storage first
  let userInfoStr = sessionStorage.getItem("userInfo");

  // If not in session, try local storage
  if (!userInfoStr) {
    userInfoStr = localStorage.getItem("userInfo");
  }

  if (userInfoStr) {
    return JSON.parse(userInfoStr);
  }

  return null;
};

/**
 * Checks if the user is currently authenticated
 */
export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null;
};

/**
 * Logs out the current user
 */
export const logout = () => {
  // Clear both storages to ensure complete logout
  sessionStorage.removeItem("authToken");
  sessionStorage.removeItem("userInfo");
  localStorage.removeItem("authToken");
  localStorage.removeItem("userInfo");
};
