import axios from "axios";
import { AuthResponse } from "./types";

const API_URL = "http://localhost:5000/auth"; // adjust if needed

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
