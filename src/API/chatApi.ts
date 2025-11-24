import axios from "axios";
import type { Chat } from "../types/chat";

const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

// Choose API based on environment
const urlStart = isLocalhost
  ? import.meta.env.VITE_BACKEND_DEVAPI   // local dev
  : import.meta.env.VITE_BACKEND_API;      // production

const URL = urlStart + "/chats/";

// ------------------ CHATS ------------------

// Get all chats
export const getAllChats = async (): Promise<Chat[]> => {
  const response = await axios.get(URL);
  return response.data;
};

export async function getChatsByUserId(userId: string): Promise<Chat[]> {
  if (!userId) return [];
  try {
    const response = await axios.get<Chat[]>(`${URL}user/${userId}`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch user chats:", err);
    return [];
  }
}

// // Get a single chat with optional message limit & offset
// export const getChatById = async (
//   chatId: string,
//   limit?: number,
//   offset?: number
// ): Promise<Chat> => {
//   const params: any = {};
//   if (limit) params.limit = limit;
//   if (offset) params.offset = offset;

//   const response = await axios.get(`${URL}${chatId}`, { params });
//   return response.data;
// };

export const getChatById = async (chatId: string): Promise<Chat> => {
  const response = await axios.get(`${URL}${chatId}`);
  return response.data;
};


export const addChat = async (senderId: string, receiverId: string): Promise<Chat> => {
  const response = await axios.post(URL, { senderId, receiverId });
  return response.data;
};


// Delete a chat by ID
export const deleteChat = async (chatId: string): Promise<void> => {
  await axios.delete(`${URL}${chatId}`);
}