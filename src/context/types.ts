import { Dispatch } from "react";
import type { Chat, Message } from "../types/chat";
import type { User } from "../types/user";

export interface IState {
  chats: Chat[];
  users: User[];
  messages: Message[];
  currentUser?: User; // add this
}


export enum ActionTypes {
  SET_CHATS = "SET_CHATS",
  ADD_CHAT = "ADD_CHAT",
  REMOVE_CHAT = "REMOVE_CHAT",
  SET_USERS = "SET_USERS",
  ADD_USER = "ADD_USER",
  SET_MESSAGES = "SET_MESSAGES",
  ADD_MESSAGE = "ADD_MESSAGE",
  UPDATE_USER = "UPDATE_USER", // ✅ add this line
}



export interface IAction {
  type: ActionTypes;
  payload?: unknown;
}

export interface IContext {
  state: IState;
  dispatch: Dispatch<IAction>;
}


export interface AuthResponse {
  error?: string;
  message?: string;
  userId?: string;
  token?: string;
}
