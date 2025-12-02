import { fetchWithAuth } from './authService';

const API_BASE = import.meta.env.VITE_URL_API || 'http://localhost:8000';

export async function getProfileApi(uid: string) {
  const res = await fetchWithAuth(`${API_BASE}/profiles/${encodeURIComponent(uid)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Error fetching profile: ${res.status}`);
  return await res.json();
}

export async function getMyProfileApi() {
  const res = await fetchWithAuth(`${API_BASE}/profiles/me`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Error fetching my profile: ${res.status}`);
  return await res.json();
}

export async function createProfileApi(payload: Record<string, any>) {
  const res = await fetchWithAuth(`${API_BASE}/profiles/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Error creating profile: ${res.status}`);
  return await res.json();
}

export async function updateProfileApi(uid: string, updates: Record<string, any>) {
  const res = await fetchWithAuth(`${API_BASE}/profiles/${encodeURIComponent(uid)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error(`Error updating profile: ${res.status}`);
  return await res.json();
}

export default { getProfileApi, getMyProfileApi, createProfileApi, updateProfileApi };
