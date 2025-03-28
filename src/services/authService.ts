import { LoginCredentials, UserInfo } from "../types/auth";

/**
 * Decodes a JWT token and returns the payload as an object
 */
const decodeJwtToken = (token: string): any => {
  try {
    // JWT token has 3 parts separated by dots: header.payload.signature
    const base64Url = token.split(".")[1];
    // Convert base64Url to base64
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    // Decode and parse JSON
    const payload = JSON.parse(window.atob(base64));
    return payload;
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return {};
  }
};

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

    // Decode JWT token to get additional claims
    const tokenPayload = decodeJwtToken(userData.token);

    // Extract claims from token payload
    return {
      ...userData,
      isPremium: tokenPayload.IsPremium === "True",
      role: tokenPayload.role || "User",
    };
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
