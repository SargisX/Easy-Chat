import { useContext } from "react";
import { Button } from "react-bootstrap";
import { ChatContext } from "../context/chatContext";
import { addChat } from "../context/api";
import { ActionTypes } from "../context/types";

export default function AddChatButton() {
  const { state, dispatch } = useContext(ChatContext)!;

  const handleAddChat = async () => {
    try {
      // Find users not already in chats
      const existingUserIds = state.chats.map(c => c.userId);
      const availableUsers = state.users.filter(u => u.id !== 0 && !existingUserIds.includes(u.id));
      if (availableUsers.length === 0) {
        alert("No more users to chat with!");
        return;
      }

      const userToChat = availableUsers[0]; // pick first available user

      // Add chat via backend
      const newChat = await addChat({ userId: userToChat.id, lastMessageId: 0, messages: [] });

      // Update state
      dispatch({ type: ActionTypes.putChats, payload: [...state.chats, newChat] });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Button
      variant="primary"
      onClick={handleAddChat}
      style={{
        position: "absolute",
        bottom: "20px",
        right: "20px",
        borderRadius: "50%",
        width: "50px",
        height: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px",
        padding: 0,
      }}
    >
      +
    </Button>
  );
}
