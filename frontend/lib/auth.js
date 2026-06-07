import { loginUserApi } from "./api";

const AUTH_KEY = "hotel_auth";

function normalizeRole(role) {
  const value = String(role || "")
    .trim()
    .toLowerCase();

  if (!value) return "user";
  if (value.includes("admin") || value.includes("admintambah")) return "admin";
  if (value.includes("user") || value.includes("tamu")) return "user";

  return value;
}

function getPermissions(role) {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === "admin") {
    return [
      "admintambah kamar",
      "edit kamar",
      "hapus kamar",
      "lihat semua booking",
      "userlihat kamar",
      "booking kamar",
    ];
  }

  return ["userlihat kamar", "booking kamar"];
}

export function getAuth() {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(AUTH_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function saveAuth(authData) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_KEY);
}

export async function loginUser(email, password) {
  try {
    const response = await loginUserApi(email.trim().toLowerCase(), password);
    const user = response?.user || {};
    const normalizedRole = normalizeRole(user.role || user.level || "user");

    const authData = {
      id: user.id ?? null,
      name: user.nama || user.name || "",
      email: user.email || email,
      role: normalizedRole,
      permissions: getPermissions(normalizedRole),
      isAdmin: normalizedRole === "admin" || Boolean(user.isAdmin),
    };

    saveAuth(authData);
    return authData;
  } catch (error) {
    const message =
      error?.message || (typeof error === "string" ? error : "Login gagal");

    throw new Error(message);
  }
}
