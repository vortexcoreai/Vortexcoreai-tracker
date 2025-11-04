// auth.js
import { api, setPayloadConfig } from "./payloadApi.js";

// ✅ LOGIN FUNCTION
export async function login(email, password) {
  const res = await api("users/login", "POST", { email, password });

  if (res?.token) {
    localStorage.setItem("payload_token", res.token);
    setPayloadConfig({ token: res.token });
  }

  return res;
}

// ✅ LOGOUT FUNCTION
export function logout() {
  localStorage.removeItem("payload_token");
  setPayloadConfig({ token: "" });
}

// ✅ CHECK IF LOGGED IN
export function isAuthenticated() {
  const token = localStorage.getItem("payload_token");
  return !!token;
}

// ✅ GET CURRENT USER INFO
export async function getAuthUser() {
  const res = await api("users/me", "GET");
  return res.user || null;
}
