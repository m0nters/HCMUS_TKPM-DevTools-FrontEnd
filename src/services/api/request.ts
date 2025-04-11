// Helper function for API requests
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `/api/v1${endpoint}`;
  // Ensure Content-Type is set when there's a body
  if (options.body && !options.headers) {
    options.headers = {
      "Content-Type": "application/json",
    };
  } else if (options.body) {
    options.headers = {
      ...options.headers,
      "Content-Type": "application/json",
    };
  }
  // Make sure we're setting the content-type as JSON
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
      headers,
      ...options,
    });

    if (!response.ok) {
      // Use a cloned response for error handling to avoid the "body stream already read" issue
      let errorMessage = `API error: ${response.status}`;

      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          // If JSON parsing fails, try to get text
          try {
            errorMessage = (await response.text()) || errorMessage;
          } catch (textError) {
            // If we can't get text either, use the default error message
          }
        }
      } else {
        try {
          errorMessage = (await response.text()) || errorMessage;
        } catch (textError) {
          // If we can't get text, use the default error message
        }
      }

      throw new Error(errorMessage);
    }

    // Check if the response is empty (204 No Content)
    if (response.status === 204) {
      return {} as T;
    }

    // Check content type to determine how to parse the response
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      return (await response.json()) as T;
    } else {
      // Handle text responses
      const text = await response.text();
      try {
        // Try to parse as JSON anyway in case content-type header is wrong
        return JSON.parse(text) as T;
      } catch {
        // Return as text if it's not JSON
        return text as unknown as T;
      }
    }
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    throw error;
  }
}
