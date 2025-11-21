import { ActionTypes, IAction, IState } from "./types";

export const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case ActionTypes.SET_CHATS:
      return { ...state, chats: (action.payload as IState["chats"]) || [] };

    case ActionTypes.ADD_CHAT:
      return {
        ...state,
        chats: [...state.chats, (action.payload as IState["chats"][0])],
      };

    case ActionTypes.REMOVE_CHAT:
      return {
        ...state,
        chats: state.chats.filter((c) => c.id !== (action.payload as string)),
      };

    case ActionTypes.SET_USERS:
      return { ...state, users: (action.payload as IState["users"]) || [] };

    case ActionTypes.ADD_USER:
      return {
        ...state,
        users: [...state.users, (action.payload as IState["users"][0])],
      };

    case ActionTypes.SET_MESSAGES:
      return { ...state, messages: (action.payload as IState["messages"]) || [] };

    case ActionTypes.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, (action.payload as IState["messages"][0])],
      };
    case ActionTypes.UPDATE_USER:
      const updatedUser = action.payload as IState["users"][0];
      return {
        ...state,
        users: state.users.map((u) => (u.id === updatedUser.id ? { ...u, ...updatedUser } : u)),
        currentUser: state.currentUser?.id === updatedUser.id ? { ...state.currentUser, ...updatedUser } : state.currentUser,
      };


    default:
      return state;
  }
};
