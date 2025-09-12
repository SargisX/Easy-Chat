import { Dispatch } from "react";
import type{ Chat, } from "../types/chat";
import type { User } from "../types/user";

export interface IState{
    chats:Chat[];
    users: User[];
}

export enum ActionTypes {
    send,
    delete,
    edit,
    putChats,
    putUsers,   // 👈 new
  }
  

export interface IAction{
    type:ActionTypes
    payload:unknown
}

export interface IContext{
    state:IState
    dispatch:Dispatch<IAction>
}

export interface AuthResponse {
    error?: string;
    message?: string;
    userId?: string;
    token?: string;
  }