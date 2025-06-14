import { LoginCredentials, RegisterCredentials, UserInfo } from "../types";
import { apiRequest } from "./api/";

/**
 * Interface representing standard JWT claims
 */
interface BaseJwtClaims {
  /** Expiration time (Unix timestamp in seconds) */
  exp: number;
  /** Issued at time (Unix timestamp in seconds) */
  iat: number;
  /** Not valid before (Unix timestamp in seconds) */
  nbf: number;
  /** Issuer */
  iss?: string;
  /** Audience */
  aud?: string;
}

/**
 * Interface representing your application-specific JWT claims
 */
export interface JwtPayload extends BaseJwtClaims {
  /** User's unique ID */
  Id: string;
  /** User's email address */
  email: string;
  /** User's username */
  given_name: string;
  /** User's full name */
  FullName: string;
  /** User's role (User, Premium, Admin) */
  role: "User" | "Premium" | "Admin";
}

/**
 * Decodes a JWT token and returns the payload as a typed object
 */
const decodeJwtToken = (token: string): JwtPayload => {
  try {
    // JWT token has 3 parts separated by dots: header.payload.signature
    const base64Url = token.split(".")[1];
    // Convert base64Url to base64
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    // Decode and parse JSON
    const payload = JSON.parse(window.atob(base64)) as JwtPayload;
    return payload;
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    // Return a minimal valid payload with immediate expiration
    return {
      Id: "",
      email: "",
      given_name: "",
      FullName: "",
      role: "User",
      exp: 0,
      iat: 0,
      nbf: 0,
    };
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
export const clearUserSession = () => {
  const storageKeys = ["userInfo", "token"];
  storageKeys.forEach((key) => {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  });
};

/**
 * Gets the expiration time from the JWT token
 * @returns Expiration timestamp in seconds or null if no valid token
 */
export const getTokenExpiration = (): number | null => {
  // Try getting token from both storages
  const token =
    sessionStorage.getItem("token") || localStorage.getItem("token");

  if (!token) return null;

  const tokenPayload = decodeJwtToken(token);
  return tokenPayload.exp;
};

/**
 * Checks if the current token is expired
 * @returns true if expired, false otherwise
 */
export const isTokenExpired = (): boolean => {
  const expiration = getTokenExpiration();
  if (!expiration) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return expiration <= currentTime;
};
