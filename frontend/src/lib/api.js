const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8080";

export async function apiFetch(
  endpoint,
  options = {}
) {
  const token =
    localStorage.getItem("stockmate-token");

  const headers = {
    ...(options.headers || {}),
  };

  // Add JSON content type when a body exists
  if (
    options.body &&
    !headers["Content-Type"]
  ) {
    headers["Content-Type"] =
      "application/json";
  }

  // Attach JWT
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  // Automatically handle expired/invalid JWT
  if (response.status === 401) {
    localStorage.removeItem(
      "stockmate-token"
    );

    localStorage.removeItem(
      "stockmate-user"
    );

    localStorage.removeItem(
      "stockmate-name"
    );

    localStorage.removeItem(
      "stockmate-email"
    );

    window.location.href = "/";
    
    throw new Error(
      "Your session has expired. Please sign in again."
    );
  }

  const responseText =
    await response.text();

  let data = null;

  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      data = responseText;
    }
  }

  if (!response.ok) {
    const message =
      typeof data === "object" && data?.message
        ? data.message
        : typeof data === "string"
        ? data
        : "Request failed";

    throw new Error(message);
  }

  return data;
}

export default apiFetch;