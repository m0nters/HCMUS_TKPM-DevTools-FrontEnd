// Helper function for API requests
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `/api/v1${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      // Try to get error details if available
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `API error: ${response.status}`);
      } catch {
        // If error response isn't JSON
        const errorText = await response.text();
        throw new Error(errorText || `API error: ${response.status}`);
      }
    }

    console.log(response);

    // Check if the response is empty (204 No Content)
    if (response.status === 204) {
      return "" as unknown as T;
    }

    // Check content type to determine how to parse the response
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      return (await response.json()) as T;
    } else {
      // Handle text responses
      const text = await response.text();
      return text as unknown as T;
    }
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    throw error;
  }
}
