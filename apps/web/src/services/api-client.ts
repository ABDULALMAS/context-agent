const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ApiErrorResponse = {
  error?: string;
};

const handleResponse = async <T>(response: Response, path: string): Promise<T> => {
  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401 && path !== "/auth/") {
      window.location.replace("/login");
    }

    const errorData = data as ApiErrorResponse;
    throw new Error(errorData.error ?? "Something went wrong.");
  }

  return data as T;
};

export const apiClient = {
  post: async <T>(path: string, body?: unknown): Promise<T> => {
    const response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      ...(body !== undefined && { body: JSON.stringify(body) }),
    });

    return handleResponse<T>(response, path);
  },

  get: async <T>(path: string): Promise<T> => {
    const response = await fetch(`${API_URL}${path}`, {
      method: "GET",
      credentials: "include",
    });

    return handleResponse<T>(response, path);
  },
};
