import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Form, InputGroup, ListGroup } from "react-bootstrap";
import type { InputMessage, Chat,  } from "../types/chat";
import { addMessage, getChatById, getUserById } from "../context/api";
import type { User } from "../types/user";

export default function ChatWindow() {
  const { id } = useParams();
  const chatId = Number(id);

  const [chat, setChat] = useState<Chat | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [input, setInput] = useState("");

  // Fetch chat with last 50 messages
  useEffect(() => {
    const fetchChatAndUser = async () => {
      try {
        const chatData = await getChatById(chatId, 50, 0);
        setChat(chatData);

        const userData = await getUserById(chatData.userId);
        setUser(userData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchChatAndUser();
  }, [chatId]);

  if (!chat || !user) {
    return (
      <div className="d-flex align-items-center justify-content-center h-100">
        <p className="text-muted">Select a chat to start messaging</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: InputMessage = {
      content: input,
      date: Date.now(),
      receiverId: chat.userId,
      senderId: 0,
    };

    try {
      const savedMessage = await addMessage(chat.id, newMessage);
      // Update local chat state directly
      setChat(prev => prev ? { ...prev, messages: [...prev.messages, savedMessage] } : prev);
      setInput("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="d-flex flex-column h-100">
      <h5 className="border-bottom p-3 mb-0">Chat with {user.username}</h5>

      <ListGroup className="flex-grow-1 overflow-auto p-3" style={{ maxHeight: "calc(100% - 120px)" }}>
        {(chat.messages || []).map(msg => {
          const sender = msg.senderId === 0 ? "Me" : `User ${msg.senderId}`;
          return (
            <ListGroup.Item
              key={msg.id}
              className={`mb-2 p-2 rounded ${msg.senderId === 0 ? "text-end bg-primary text-white" : "text-start bg-light"}`}
            >
              <div className="small fw-bold">{sender}</div>
              {msg.content}
            </ListGroup.Item>
          );
        })}
      </ListGroup>

      <Form onSubmit={handleSubmit} className="p-3 border-top">
        <InputGroup>
          <Form.Control
            placeholder="Type a message..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <Button type="submit" variant="primary">Send</Button>
        </InputGroup>
      </Form>
    </div>
  );
}
