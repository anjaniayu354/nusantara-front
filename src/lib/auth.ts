"use client";

export interface AuthUser {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  avatar?: string;
  provider: "phone" | "google";
  loggedInAt: string;
}

const STORAGE_KEY = "nusantara_auth_user";
const AUTH_EVENT = "nusantara_auth_change";

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthUser): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    window.dispatchEvent(new CustomEvent(AUTH_EVENT, { detail: user }));
  } catch (err) {
    console.error("Failed to store auth user:", err);
  }
}

export function clearStoredUser(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(AUTH_EVENT, { detail: null }));
  } catch (err) {
    console.error("Failed to clear auth user:", err);
  }
}

export function subscribeAuth(callback: (user: AuthUser | null) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleCustom = (e: Event) => {
    const custom = e as CustomEvent<AuthUser | null>;
    callback(custom.detail);
  };

  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback(getStoredUser());
    }
  };

  window.addEventListener(AUTH_EVENT, handleCustom);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(AUTH_EVENT, handleCustom);
    window.removeEventListener("storage", handleStorage);
  };
}

export async function loginWithPhone(phone: string, _password: string): Promise<AuthUser> {
  // Simulate network latency for authentic feel
  await new Promise((resolve) => setTimeout(resolve, 800));

  const cleanPhone = phone.trim();
  const formattedPhone = cleanPhone.startsWith("0")
    ? `+62 ${cleanPhone.slice(1, 4)}-${cleanPhone.slice(4, 8)}-${cleanPhone.slice(8)}`
    : cleanPhone.startsWith("+62")
    ? cleanPhone
    : `+62 ${cleanPhone}`;

  const user: AuthUser = {
    id: `user-phone-${Date.now()}`,
    name: "Petualang Nusantara",
    phone: formattedPhone,
    avatar: "/mandala.png",
    provider: "phone",
    loggedInAt: new Date().toISOString(),
  };

  setStoredUser(user);
  return user;
}

export async function loginWithGoogle(): Promise<AuthUser> {
  // Simulate Google OAuth handshake
  await new Promise((resolve) => setTimeout(resolve, 700));

  const user: AuthUser = {
    id: `user-google-${Date.now()}`,
    name: "Penjelajah Budaya (Google)",
    email: "penjelajah.nusantara@gmail.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    provider: "google",
    loggedInAt: new Date().toISOString(),
  };

  setStoredUser(user);
  return user;
}

export function logout(): void {
  clearStoredUser();
}
