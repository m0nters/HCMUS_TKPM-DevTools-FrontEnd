/**
 * Helper function for making API requests with proper error handling and response parsing
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `/api/v1${endpoint}`;

  // Set default headers but allow overrides
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Early return for empty responses
    if (response.status === 204) {
      return {} as T;
    }

    // Handle error responses
    if (!response.ok) {
      const error = await getErrorMessage(response);
      throw new Error(error);
    }

    // Parse successful response
    return await parseResponse<T>(response);
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    throw error;
  }
}

/**
 * Extract error message from response
 */
async function getErrorMessage(response: Response): Promise<string> {
  const contentType = response.headers.get("content-type") || "";
  let errorMessage = `API error: ${response.status}`;

  try {
    if (contentType.includes("application/json")) {
      const errorData = await response.json();
      return errorData.message || errorData.title || errorMessage;
    } else {
      const text = await response.text();
      return text || errorMessage;
    }
  } catch {
    // If we can't read the error details, return the default error
    return errorMessage;
  }
}

/**
 * Parse response based on content type
 */
async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") || "";

  // Get response text once
  const text = await response.text();

  // Return empty response if no content
  if (!text) {
    return {} as T;
  }

  // Try parsing as JSON (even if content-type doesn't suggest JSON)
  try {
    return JSON.parse(text) as T;
  } catch {
    // If it's not valid JSON, return as text
    if (!contentType.includes("application/json")) {
      return text as unknown as T;
    }

    // If it was supposed to be JSON but parsing failed, rethrow
    throw new Error(`Failed to parse response as JSON: ${text}`);
  }
}
