import axios from "axios";
import type { Friend } from "../types/friend";

const urlStart = import.meta.env.VITE_BACKEND_DEVAPI;
// const urlStart = import.meta.env.VITE_BACKEND_API;
const FRIEND_URL = urlStart + "/friends";

// Get all friends (accepted) of a user
export const getMyFriends = async (userId: string): Promise<Friend[]> => {
  const res = await axios.get(`${FRIEND_URL}/user/${userId}`);
  return res.data;
};

// Get a single friend relation by ID
export async function getFriendById(id: string): Promise<Friend> {
  try {
    const response = await axios.get<Friend>(`${FRIEND_URL}/${id}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to fetch friend with ID ${id}`, err);
    throw err;
  }
}

// Send a friend request (status = pending)
export const addFriend = async (userId: string, friendId: string): Promise<Friend> => {
  const res = await axios.post(FRIEND_URL, { userId, friendId });
  return res.data;
};

// Delete a friend / reject request
export const deleteFriend = async (id: string): Promise<void> => {
  await axios.delete(`${FRIEND_URL}/${id}`);
};

// Accept a friend request
export const acceptFriend = async (id: string): Promise<void> => {
  await axios.patch(`${FRIEND_URL}/accept/${id}`);
};

// Reject a friend request
export const rejectFriend = async (id: string): Promise<void> => {
  await axios.delete(`${FRIEND_URL}/reject/${id}`);
};

// Get pending requests **received** by the user
export const getPendingReceived = async (userId: string): Promise<Friend[]> => {
  const res = await axios.get(`${FRIEND_URL}/pending/${userId}`);
  return res.data;
};

// Get pending requests **sent** by the user
export const getPendingSent = async (userId: string): Promise<Friend[]> => {
  const res = await axios.get(`${FRIEND_URL}/sent/${userId}`);
  return res.data;
};
