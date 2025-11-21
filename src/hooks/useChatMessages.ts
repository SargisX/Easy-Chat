import { useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";
import { messageCache } from "../utils/messageCache";
import { InputMessage, Message } from "../types/chat";
import { getChatById } from "../API/chatApi";
import { addMessage, getChatMessageCount } from "../API/messageApi";

const backend = "http://localhost:5000";

export function useChatMessages(chatId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [offset, setOffset] = useState(0); // how many messages we already loaded
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);


  const containerRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const isFetchingOlder = useRef(false);

  /* ---------------------- SOCKET INIT (run once) ---------------------- */
  useEffect(() => {
    socketRef.current = io(backend);
    return () => {socketRef.current?.disconnect()}
  }, []);

  /* ---------------------- LOAD LAST MESSAGES WHEN CHAT CHANGES ---------------------- */
  useEffect(() => {
    if (!chatId) return;
    setLoading(true)
    if (messageCache[chatId]) {
      setMessages(messageCache[chatId]);
      setOffset(messageCache[chatId].length);
      scrollToBottom();
      return; // use cache
    }

    loadMessages(0).then(() => {
      scrollToBottom();
      setLoading(false);
    });

  }, [chatId]);

 /* ---------------------- FETCH MESSAGES ---------------------- */
 async function loadMessages(newOffset: number) {
  if (!chatId || loadingOlder || !hasMore) return;

  setLoadingOlder(true);

  try {
    const count = await getChatMessageCount(chatId);
    const possibleOffset = (Math.floor(count / 50) + 1) * 50;

    if (newOffset > possibleOffset) {
      setHasMore(false);
      return;
    }

    const chat = await getChatById(chatId, 50, newOffset);
    const fetched = chat.messages || [];

    if (fetched.length === 0) {
      setHasMore(false);
      return;
    }

    let updatedMessages: Message[];
    if (newOffset === 0) {
      updatedMessages = fetched;
    } else {
      const existingIds = new Set(messages.map(m => m.id));
      const olderMessages = fetched.filter(m => !existingIds.has(m.id));
      updatedMessages = [...olderMessages, ...messages];
    }

    setMessages(updatedMessages);
    messageCache[chatId] = updatedMessages;
    setOffset(prev => prev + fetched.length);
    if (fetched.length < 50) setHasMore(false);

  } catch (err) {
    console.error("Failed to load messages:", err);
  } finally {
    setLoadingOlder(false);
  }
}


/* ---------------------- SCROLL HANDLER FOR OLDER MESSAGES ---------------------- */
useEffect(() => {
  const container = containerRef.current;
  if (!container || !chatId) return;

  const handleScroll = async () => {
    if (isFetchingOlder.current || !hasMore) return;

    // load older messages when user scrolls near top
    if (container.scrollTop < 200) {
      isFetchingOlder.current = true;

      // 1️⃣ Save distance from bottom
      const distanceFromBottom = container.scrollHeight - container.scrollTop;

      // 2️⃣ Load older messages
      await loadMessages(offset);

      // 3️⃣ Wait for DOM update
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight - distanceFromBottom;
        isFetchingOlder.current = false;
      });
    }
  };

  container.addEventListener("scroll", handleScroll);
  return () => container.removeEventListener("scroll", handleScroll);
}, [offset, hasMore, chatId]);



  /* ---------------------- SOCKET: ON NEW MESSAGE ---------------------- */
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !chatId) return;

    socket.emit("join_chat", chatId);

    const handleNewMessage = (msg: Message) => {
      setMessages(prev => {
        if (prev.some(m => m.id === msg.id)) return prev; // prevent duplicates
        const updated = [...prev, msg];
        messageCache[chatId] = updated;
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
      messageCache[chatId] = [...(messageCache[chatId] || []), saved];
      socketRef.current?.emit("send_message", saved);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  }

  /* ---------------------- SCROLL TO BOTTOM ---------------------- */
  const scrollToBottom = () => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  };

  return {
    messages,
    containerRef,
    loading,
    sendMessage,
  };
}
