/**
 * HYNOVA API Configuration & Base URL Resolver
 * 
 * Supports both unified full-stack hosting (same-origin relative URLs)
 * and split architecture (e.g. GitHub Pages frontend targeting Cloud Run HTTPS API).
 */

const RAW_API_URL = typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL
  : '';

export const API_BASE_URL = RAW_API_URL.replace(/\/$/, '');

/**
 * Resolves full API endpoint path.
 * In unified hosting, returns `/api/...`
 * In split hosting with VITE_API_BASE_URL, returns `https://<backend-host>/api/...`
 */
export function getApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (!API_BASE_URL) {
    return cleanEndpoint;
  }
  return `${API_BASE_URL}${cleanEndpoint}`;
}

/**
 * Standard headers for authenticated API requests
 */
export function getAuthHeaders(additionalHeaders: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...additionalHeaders,
  };

  if (typeof window !== 'undefined') {
    const sessionToken = sessionStorage.getItem('hynova_session_token');
    if (sessionToken) {
      headers['Authorization'] = `Bearer ${sessionToken}`;
    }
  }

  return headers;
}
