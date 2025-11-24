import { useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";
import { Message, InputMessage } from "../types/chat";
import { getChatById } from "../API/chatApi";
import { addMessage, deleteMessageById, updateMessageById } from "../API/messageApi";
import { useLocation } from "react-router-dom";

const loc = useLocation();

const isLocalhost =
  loc.pathname.includes("localhost") ||
  window.location.hostname === "localhost";

const backend = isLocalhost
  ? import.meta.env.VITE_BACKEND_DEVAPI
  : import.meta.env.VITE_BACKEND_API;
    // production


export function useChatMessages(chatId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<Socket | null>(null);

  /* ---------------------- INIT SOCKET ---------------------- */
  useEffect(() => {
    socketRef.current = io(backend);

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  /* ---------------------- LOAD MESSAGES ---------------------- */
const [chatInfo, setChatInfo] = useState<{ senderId: string; receiverId: string } | null>(null);

useEffect(() => {
  if (!chatId) return;

  setLoading(true);

  getChatById(chatId)
    .then((chat) => {
      setChatInfo({ senderId: chat.senderId, receiverId: chat.receiverId });
      const fetched = chat.messages ?? [];
      setMessages(fetched);
      scrollToBottom();
    })
    .finally(() => setLoading(false));
}, [chatId]);



  /* ---------------------- JOIN CHAT ---------------------- */
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !chatId) return;
  
    function join() {
      socket!.emit("join_chat", chatId);
    }
  
    join();
    socket.on("connect", join);
  
    const handleNewMessage = (msg: Message) => {
      setMessages(prev => {
        if (prev.some(m => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    };
  
    const handleRemoveMessage = ({ messageId }: { messageId: string }) => {
      setMessages(prev => prev.filter(m => m.id !== messageId));
    };
  
    const handleUpdateMessage = (updated: Message) => {
      setMessages(prev =>
        prev.map(m => (m.id === updated.id ? updated : m))
      );
    };
  
    socket.on("new_message", handleNewMessage);
    socket.on("delete_message", handleRemoveMessage);
    socket.on("update_message", handleUpdateMessage);
  
    return () => {
      socket.off("connect", join);
      socket.off("new_message", handleNewMessage);
      socket.off("delete_message", handleRemoveMessage);
      socket.off("update_message", handleUpdateMessage);
      socket.emit("leave_room", chatId);
    };
  
  }, [chatId]);
  

  /* ---------------------- SCROLL TO BOTTOM ---------------------- */
  const scrollToBottom = () => {
    const el = containerRef.current;
    if (!el) return;

    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  };

  /* ---------------------- SEND MESSAGE ---------------------- */
  async function sendMessage(chatId: string, msg: InputMessage) {
    try {

      const saved = await addMessage(chatId, msg);

      // emit once
      socketRef.current?.emit("send_message", saved);

      scrollToBottom();
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  }

  /* ---------------------- REMOVE MESSAGE ---------------------- */
  async function removeMessage(messageId: string) {
    try {
      await deleteMessageById(messageId); // let backend emit the event
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  }


  /* ---------------------- UPDATE MESSAGE ---------------------- */
  async function updateMessage(messageId: string, content: string) {
    try {
      // 1. Call backend PUT to update message

      const res = await updateMessageById(messageId, content, chatId! )

      // 3. Emit updated message via socket so others see it
      socketRef.current?.emit("update_message", res);

      // 4. Scroll to bottom
      scrollToBottom();
    } catch (err) {
      console.error("Failed to update message:", err);
    }
  }
  




  return {
    messages,
    containerRef,
    loading,
    sendMessage,
    removeMessage,
    updateMessage,
    chatInfo,
  };
}
