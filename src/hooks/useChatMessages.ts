import { useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";
import { messageCache } from "../utils/messageCache";
import { Message, InputMessage } from "../types/chat";
import { getChatById } from "../API/chatApi";
import { addMessage } from "../API/messageApi";

const backend = "http://localhost:5000";

export function useChatMessages(chatId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<Socket | null>(null);

  /* ---------------------- SOCKET INIT ---------------------- */
  useEffect(() => {
    socketRef.current = io(backend);
    return () => { socketRef.current?.disconnect() };
  }, []);

  /* ---------------------- LOAD MESSAGES (simple) ---------------------- */
  useEffect(() => {
    if (!chatId) return;

    // If cached, use it immediately
    if (messageCache[chatId]) {
      setMessages(messageCache[chatId]);
      scrollToBottom();
      return;
    }

    // If not cached → load from server
    setLoading(true);
    getChatById(chatId)
      .then((chat) => {
        const fetched = chat.messages || [];
        setMessages(fetched);
        messageCache[chatId] = fetched;
        scrollToBottom();
      })
      .catch((err) => console.error("Failed to load messages:", err))
      .finally(() => setLoading(false));
  }, [chatId]);

  /* ---------------------- SOCKET: NEW MESSAGE ---------------------- */
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !chatId) return;

    socket.emit("join_chat", chatId);

    const handleNewMessage = (msg: Message) => {
      setMessages((prev) => {
        // Prevent duplicates
        if (prev.some((m) => m.id === msg.id)) return prev;

        const updated = [...prev, msg];
        messageCache[chatId!] = updated;
        scrollToBottom();
        return updated;
      });
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.emit("leave_room", chatId);
    };
  }, [chatId]);

  /* ---------------------- SEND MESSAGE ---------------------- */
  async function sendMessage(chatId: string, msg: InputMessage) {
    try {
      const saved = await addMessage(chatId, msg);
      socketRef.current?.emit("send_message", saved);

      // refresh from DB once
      const chat = await getChatById(chatId);
      messageCache[chatId] = chat.messages;
      setMessages(chat.messages);
      scrollToBottom();
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  }


  /* ---------------------- SCROLL TO BOTTOM ---------------------- */
  const scrollToBottom = () => {
    const c = containerRef.current;
    if (!c) return;

    requestAnimationFrame(() => {
      c.scrollTop = c.scrollHeight;
    });
  };

  return {
    messages,
    containerRef,
    loading,
    sendMessage,
  };
}
