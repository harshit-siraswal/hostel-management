// Thin API helper. Falls back to local demo data when backend is unavailable.
import { getAuthToken, readAuthSession } from "./auth";

let BASE = (typeof process !== "undefined" && (process.env?.NEXT_PUBLIC_API_BASE_URL || process.env?.VITE_API_BASE_URL))
  || (typeof import.meta !== "undefined" ? (import.meta as any).env?.VITE_API_BASE_URL : "")
  || "";

if (!BASE && typeof window !== "undefined" && window.location.hostname === "localhost") {
  BASE = "http://localhost:4000";
}

export async function api<T>(path: string, fallback: T, init?: RequestInit): Promise<T> {
  const session = readAuthSession();
  const isDemo = !session || session.provider === "demo";

  if (!BASE) {
    if (isDemo) return fallback;
    throw new Error("Backend API base URL is not configured. Please configure VITE_API_BASE_URL.");
  }

  const token = getAuthToken();
  try {
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
  } catch (error) {
    if (isDemo) return fallback;
    throw error;
  }
}
