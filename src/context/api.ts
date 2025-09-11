import axios from "axios";
import type { Chat, InputChat, InputMessage, Message } from "../types/chat";
import type { User } from "../types/user";

const URL = "http://localhost:5000/chats/";
const USER_URL = "http://localhost:5000/users/";
const MESSAGE_URL = "http://localhost:5000/messages/";

// ------------------ CHATS ------------------

// Get all chats
export const getAllChats = async (): Promise<Chat[]> => {
  const response = await axios.get(URL);
  return response.data;
};

// Get a single chat with optional message limit & offset
export const getChatById = async (
  chatId: number,
  limit?: number,
  offset?: number
): Promise<Chat> => {
  const params: any = {};
  if (limit) params.limit = limit;
  if (offset) params.offset = offset;

  const response = await axios.get(`${URL}${chatId}`, { params });
  return response.data;
};

// Add a new chat
export const addChat = async (obj: InputChat): Promise<Chat> => {
  const response = await axios.post(URL, obj);
  return response.data;
};

// Delete a chat by ID
export const deleteChat = async (chatId: number): Promise<void> => {
  await axios.delete(`${URL}${chatId}`);
}
// ------------------ MESSAGES ------------------

// Add a new message (frontend API)
export const addMessage = async (
  chatId: number,
  obj: InputMessage
): Promise<Message> => {
  // include chatId in the request body
  const response = await axios.post(MESSAGE_URL, {
    chatId,
    ...obj
  });
  return response.data;
};


// ------------------ USERS ------------------

// Get all users
export const getAllUsers = async (): Promise<User[]> => {
  const response = await axios.get(USER_URL);
  return response.data;
};

// Get a single user by ID
export const getUserById = async (userId: number): Promise<User> => {
  const response = await axios.get(`${USER_URL}${userId}`);
  return response.data;
};
