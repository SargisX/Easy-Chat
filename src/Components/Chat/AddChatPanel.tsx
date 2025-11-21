import { useContext, useEffect, useState } from "react";
import { Form, Button, ListGroup, Spinner } from "react-bootstrap";
import { addChat } from "../../API/chatApi";
import { User } from "../../types/user";
import { getAllUsers, getUserById } from "../../API/usersApi";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../../context/chatContext";
import { ActionTypes } from "../../context/types";
import { userCache } from "../../utils/userCache";
import { Chat } from "../../types/chat";

interface AddChatPanelProps {
  onClose: () => void;
  onChatAdded?: () => void;
  existingChats?: Chat[];
}

export default function AddChatPanel({ onClose, onChatAdded, existingChats }: AddChatPanelProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [addingUserId, setAddingUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const ctx = useContext(ChatContext);
  const currentUserId = localStorage.getItem("userId") || "";

  if (!ctx) throw new Error("AddChatPanel must be used inside ChatProvider");
  const { dispatch } = ctx;

  useEffect(() => {
    let mounted = true;

    async function fetchUsers() {
      try {
        setLoading(true);

        // Get current user just to be sure we have the correct ID
        const currentUser = await getUserById(currentUserId);

        const allUsers = await getAllUsers();

        // Filter out the current user
        const filteredUsers = allUsers.filter(
          (u) => u.id !== currentUser.id
        );

        if (mounted) setUsers(filteredUsers);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchUsers();
    return () => {
      mounted = false;
    };
  }, [currentUserId]);

  async function handleAddChat(userId: string) {
    try {
      setAddingUserId(userId);
      const chat = await addChat(userId, currentUserId);

      // Add the user to local users state if not already present
      const otherUser = await getUserById(userId);
      dispatch({ type: ActionTypes.ADD_CHAT, payload: chat });

      // Also update user cache / users state directly
      userCache[userId] = otherUser;

      if (onChatAdded) onChatAdded();
      onClose();
      // navigate to the new chat route
      navigate(`/Easy-Chat/chat/${chat.id}`);
    } catch (err) {
      console.error("Add chat failed:", err);
      alert("Could not create chat");
    } finally {
      setAddingUserId(null);
    }
  }

  const filtered = users.filter((u) => {
    // Filter by search term
    if (!u.username?.toLowerCase().includes(search.toLowerCase())) return false;

    // ✅ Skip users that already have a chat with current user
    const alreadyInChat = existingChats?.some(chat =>
      chat.senderId === u.id || chat.receiverId === u.id
    );
    if (alreadyInChat) return false;

    return true;
  });


  return (
    <div
      className="position-absolute bg-light border-top shadow-sm"
      style={{ bottom: 0, left: 0, width: "100%", height: "250px", zIndex: 999, display: "flex", flexDirection: "column" }}
    >
      <div className="d-flex p-2 border-bottom bg-white align-items-center">
        <Form.Control
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="me-2"
        />
        <Button variant="outline-secondary" onClick={onClose}>
          ✕
        </Button>
      </div>

      <div className="flex-grow-1 overflow-auto">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <ListGroup variant="flush">
            {filtered.map((user) => (
              <ListGroup.Item
                key={user.id}
                action
                onClick={() => handleAddChat(user.id)}
                disabled={addingUserId === user.id}
              >
                {user.username || user.id}
                {addingUserId === user.id && " (Adding...)"}
              </ListGroup.Item>
            ))}
          </ListGroup>

        )}
      </div>
    </div>
  );
}
