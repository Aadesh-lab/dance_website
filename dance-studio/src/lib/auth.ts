import { api, clearToken, setToken, getToken } from './api';

export async function login(username: string, password: string) {
  const res = await api.post<{ token: string }>('/api/admin/login', { username, password });
  setToken(res.token);
  return res;
}

export function logout() {
  clearToken();
}

export function isAuthed(): boolean {
  return !!getToken();
}
