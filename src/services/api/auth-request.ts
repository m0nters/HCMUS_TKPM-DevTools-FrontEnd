import { apiRequest } from "./request";

/**
 * Makes an authenticated API request with JWT token
 */
export async function withAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    sessionStorage.getItem("token") || localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  // Make request with auth headers
  return apiRequest<T>(endpoint, { ...options, headers });
}
