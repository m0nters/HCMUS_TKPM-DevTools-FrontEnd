import { apiRequest } from "./request";

/**
 * Makes an authenticated API request with JWT token
 */
export async function withAuth<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token =
    sessionStorage.getItem("token") || localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
    Authorization: `Bearer ${token}`,
  };

  // Only set Content-Type if not FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // Make request with auth headers
  return apiRequest<T>(endpoint, { ...options, headers });
}
