// Use VITE_API_URL from .env, or fallback to localhost
export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const API_URL = API_BASE; // Alias for backward compatibility if needed

export function apiUrl(path: string) {
  if (!path) return API_URL;
  if (path.startsWith('/')) return `${API_URL}${path}`;
  return `${API_URL}/${path}`;
}

export default apiUrl;
