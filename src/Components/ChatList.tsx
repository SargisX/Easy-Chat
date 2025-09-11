import { useContext, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ChatContext } from "../context/chatContext";
import AddChatButton from "./AddChatBtn";
import ChatContextMenu from "./ChatContextMenu";
import ConfirmationModal from "./ConfirmationModal";
import { deleteChat } from "../context/api"; // we’ll create this function
import { ActionTypes } from "../context/types";

export default function ChatList() {
  const { state, dispatch } = useContext(ChatContext)!;

  // State for context menu
  const [menu, setMenu] = useState<{ x: number; y: number; chatId: number } | null>(null);

  // State for confirmation modal
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  // Right-click handler
  const handleContextMenu = (e: React.MouseEvent, chatId: number) => {
    e.preventDefault();
    setMenu({ x: e.clientX, y: e.clientY, chatId });
  };

  // Delete button from context menu clicked
  const handleDeleteClick = () => {
    if (menu) setConfirmDelete(menu.chatId);
    setMenu(null);
  };

  // Confirm deletion in modal
  const handleConfirmDelete = async () => {
    if (confirmDelete === null) return;

    try {
      await deleteChat(confirmDelete); // call API
      dispatch({
        type: ActionTypes.delete,
        payload: { chatId: confirmDelete },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setConfirmDelete(null);
    }
  };

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <ListGroup variant="flush" className="border-end vh-100">
        {state.chats.map((chat) => {
          const lastMessage = chat.messages?.find((m) => m.id === chat.lastMessageId);
          const user = state.users.find((u) => u.id === chat.userId);

          return (
            <ListGroup.Item
              key={chat.id}
              action
              onContextMenu={(e) => handleContextMenu(e, chat.id)}
            >
              <Link
                to={`/Easy-Chat/chat/${chat.id}`}
                className="text-decoration-none text-dark d-block"
              >
                <div className="fw-bold">{user ? user.username : `User ${chat.userId}`}</div>
                <small className="text-muted">
                  {lastMessage ? lastMessage.content : "No messages yet"}
                </small>
              </Link>
            </ListGroup.Item>
          );
        })}
      </ListGroup>

      {/* Floating Add Chat Button */}
      <AddChatButton />

      {/* Context Menu */}
      {menu && (
        <ChatContextMenu
          x={menu.x}
          y={menu.y}
          onClose={() => setMenu(null)}
          onDelete={handleDeleteClick} // pass delete callback
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        show={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this chat?"
      />
    </div>
  );
}
