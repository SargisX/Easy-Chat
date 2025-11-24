import axios from "axios";
import { InputMessage, Message } from "../types/chat";

const urlStart = import.meta.env.VITE_BACKEND_DEVAPI;
// const urlStart = import.meta.env.VITE_BACKEND_API;
const MESSAGE_URL = urlStart + "/messages/";


// ------------------ MESSAGES ------------------

// Add a new message (frontend API)
export const addMessage = async (
  chatId: string,
  obj: InputMessage
): Promise<Message> => {
  // include chatId in the request body
  const response = await axios.post(MESSAGE_URL, {
    ...obj,
    chatId, // ensures chatId in the request is correct
  });

  return response.data;
};

// Get message by ID
export const getMessageById = async (id: string): Promise<Message> => {
  const response = await axios.get(`${MESSAGE_URL}${id}`);
  return response.data;
};


export async function getChatMessageCount(chatId: string): Promise<number> {
  try {
    const res = await axios.get(`${MESSAGE_URL}length`, {
      params: { chatId }
    });
    return res.data;
  } catch (err) {
    console.error("Failed to fetch chat message count:", err);
    return 0; // fallback
  }
}

export async function deleteMessageById(id: string): Promise<void> {
  try {
    await axios.delete(`${MESSAGE_URL}${id}`);
  } catch (err) {
    console.error("Failed to delete message:", err);
  }
}


export async function updateMessageById(id: string, content: string,chatId: string): Promise<void> {
  try {
    const res = await axios.put(`${MESSAGE_URL}${id}`, { content ,chatId}); // ✅ send "content"
    return res.data;
  } catch (err) {
    console.error("Failed to update message:", err);
  }
}
