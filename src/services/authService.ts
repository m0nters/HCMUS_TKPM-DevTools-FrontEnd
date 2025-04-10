import { RegisterCredentials, LoginCredentials, UserInfo } from "../types/auth";
import { apiRequest } from "./api/base";

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
 * Registers a new user
 */
export const register = async (
  userData: RegisterCredentials
): Promise<void> => {
  try {
    await apiRequest<void>("/account/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

/**
 * Logs in a user and returns user information with JWT token
 */
export const login = async (
  credentials: LoginCredentials
): Promise<UserInfo> => {
  try {
    const userData = await apiRequest<UserInfo>("/account/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    // Decode JWT token to get additional claims
    const tokenPayload = decodeJwtToken(userData.token);

    // Extract claims from token payload
    return {
      ...userData,
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
  const { token, ...userInfoWithoutToken } = userInfo;
  storage.setItem("token", token);
  storage.setItem("userInfo", JSON.stringify(userInfoWithoutToken));
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
 * Logs out the current user
 */
export const logout = () => {
  // Clear both storages to ensure complete logout
  sessionStorage.removeItem("userInfo");
  sessionStorage.removeItem("token");
  localStorage.removeItem("userInfo");
  localStorage.removeItem("token");
};
