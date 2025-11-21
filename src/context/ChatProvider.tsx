import { useReducer } from "react";
import { ChatContext } from "./chatContext";
import { reducer } from "./reducer";
import { initialState } from "./initialState";

/**
 * Wrap your app with <ChatProvider> so components can use ChatContext.
 *
 * Example (in index.tsx or App.tsx):
 * <ChatProvider>
 *   <App />
 * </ChatProvider>
 */
export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
}
