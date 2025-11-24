import axios from "axios";
import { AuthResponse } from "../context/types";

const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

// Choose API based on environment
const urlStart = isLocalhost
  ? import.meta.env.VITE_BACKEND_DEVAPI   // local dev
  : import.meta.env.VITE_BACKEND_API;
const API_URL = urlStart + "/auth"; // adjust if needed

export async function register(username: string, password: string): Promise<AuthResponse> {
  try {
    const res = await axios.post<AuthResponse>(`${API_URL}/register`, {
      username,
      password,
    });
    return res.data;
  } catch (error: any) {
    console.error("Register error:", error);
    return { error: error.response?.data?.error || "Registration failed" };
  }
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  try {
    const res = await axios.post<AuthResponse>(`${API_URL}/login`, {
      username,
      password,
    });
    return res.data;
  } catch (error: any) {
    console.error("Login error:", error);
    return { error: error.response?.data?.error || "Login failed" };
  }
}
