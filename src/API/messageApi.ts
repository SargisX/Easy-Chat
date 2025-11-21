import axios from "axios";
import { InputMessage, Message } from "../types/chat";

const MESSAGE_URL = "http://localhost:5000/messages/";


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