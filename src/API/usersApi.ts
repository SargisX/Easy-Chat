import axios from "axios";
import { User } from "../types/user";

const USER_URL = "http://localhost:5000/users/";


// ------------------ USERS ------------------

// Get all users
export const getAllUsers = async (): Promise<User[]> => {
  const response = await axios.get(USER_URL);
  return response.data;
};

// Get a single user by ID
export const getUserById = async (userId: string): Promise<User> => {
  const response = await axios.get(`${USER_URL}${userId}`);
  return response.data;
};


// Get users with limit and offset
export const getUsersPaginated = async (limit = 5, offset = 0): Promise<User[]> => {
  const response = await axios.get(`${USER_URL}paginated?limit=${limit}&offset=${offset}`);
  return response.data;
}


export async function updateUserStatus(userId: string, status: string) {
  try {
    const res = await axios.patch(`${USER_URL}${userId}/status`, { status });
    return res.data;
  } catch (err) {
    console.error("Failed to update user status:", err);
    throw err;
  }
}

export async function deleteAllUsers() {
  const res = await axios.delete(`${USER_URL}`);
  return res.data;
}

// ✅ Update user profile (username, displayName, bio, avatarUrl)
export async function updateUserProfile(id: string, data: any) {
  const res = await axios.patch(`${USER_URL}${id}`, data);
  return res.data;
}

export async function logout() {
  try {
    localStorage.clear();
    return { success: 1, message: "Logout successful" };
  } catch (err) {
    return { success: 0, message: "Logout failed" };
  }
}