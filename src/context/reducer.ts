import { Chat } from "../types/chat";
import { User } from "../types/user";
import { ActionTypes, IAction, IState } from "./types";

export const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case ActionTypes.putChats:
      return { ...state, chats: action.payload as Chat[] };

    case ActionTypes.putUsers:
      return { ...state, users: action.payload as User[] };

    case ActionTypes.send:
      const { chatId, message } = action.payload as { chatId: number; message: any };
      return {
        ...state,
        chats: state.chats.map((c) =>
          c.id === chatId
            ? {
                ...c,
                messages: [...(c.messages || []), message], // <-- fix here
                lastMessageId: message.id,
              }
            : c
        ),
      };

    case ActionTypes.delete:
      const { chatId: deleteId } = action.payload as { chatId: number };
      return {
        ...state,
        chats: state.chats.filter((c) => c.id !== deleteId),
      };

    default:
      return state;
  }
};
