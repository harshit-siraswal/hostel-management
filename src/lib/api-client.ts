// Thin API helper. Falls back to local demo data when backend is unavailable.
import { getAuthToken } from "./auth";

const BASE = (typeof process !== "undefined" && (process.env?.NEXT_PUBLIC_API_BASE_URL || process.env?.VITE_API_BASE_URL))
  || (typeof import.meta !== "undefined" ? (import.meta as any).env?.VITE_API_BASE_URL : "")
  || "";

export async function api<T>(path: string, fallback: T, init?: RequestInit): Promise<T> {
  if (!BASE) return fallback;
  try {
    const token = getAuthToken();
    const res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: {
        "content-type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init?.headers || {}),
      },
    });
    if (!res.ok) throw new Error(`${res.status}`);
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}
