// Thin fetch wrapper. Reads JWT from localStorage for admin routes.

// In dev: default to the local backend on :8080.
// In prod (backend serves the built SPA): default to same-origin so no
// VITE_API_URL is needed at Railway build time.
const configured = import.meta.env.VITE_API_URL;
const fallback = import.meta.env.PROD ? '' : 'http://localhost:8080';
export const API_URL = (configured || fallback).replace(/\/$/, '');

const TOKEN_KEY = 'lldance:token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(t: string) {
  localStorage.setItem(TOKEN_KEY, t);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, init: RequestInit = {}, auth = false): Promise<T> {
  const headers = new Headers(init.headers || {});
  if (!headers.has('Content-Type') && init.body && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (auth) {
    const tok = getToken();
    if (tok) headers.set('Authorization', `Bearer ${tok}`);
  }
  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (!res.ok) {
    let msg = `${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      if (body?.error) msg = body.error;
    } catch { /* ignore */ }
    throw new Error(msg);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  get:  <T>(p: string, auth = false) => request<T>(p, { method: 'GET' }, auth),
  post: <T>(p: string, body?: unknown, auth = false) =>
    request<T>(p, { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) }, auth),
  put:  <T>(p: string, body?: unknown, auth = false) =>
    request<T>(p, { method: 'PUT', body: body === undefined ? undefined : JSON.stringify(body) }, auth),
  del:  <T>(p: string, auth = false) => request<T>(p, { method: 'DELETE' }, auth),
  upload: async (file: File): Promise<{ url: string }> => {
    const fd = new FormData();
    fd.append('file', file);
    return request('/api/admin/upload', { method: 'POST', body: fd }, true);
  },
};
