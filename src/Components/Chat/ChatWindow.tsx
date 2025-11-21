import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Form, InputGroup, Button, Spinner } from "react-bootstrap";
import { getChatById } from "../../API/chatApi";
import { getUserById } from "../../API/usersApi";
import ChatMessage from "./ChatMessage";
import { useChatMessages } from "../../hooks/useChatMessages";
import { useSwipeToggle } from "../../hooks/useSwipeToggle";


interface WindowType {
  openChatList?: (open: boolean) => void
  chatList?: any
  isMobile?: boolean
}

export default function ChatWindow({ isMobile, openChatList, chatList }: WindowType) {
  const params = useParams<{ id?: string; chatId?: string }>();
  const chatId = params.chatId || params.id || "";
  const currentUserId = localStorage.getItem("userId") || "";

  const [chatUser, setChatUser] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const { messages, containerRef, loading, sendMessage } =
    useChatMessages(chatId);

  const swipe = useSwipeToggle({
    isOpen: chatList,
    setOpen: openChatList!
  });


  // Scroll to bottom when messages update
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth", // smooth scrolling
      });
    }
  }, [messages]);

  useEffect(() => {
    if (!chatId || !currentUserId) return;

    async function fetchUsers() {
      try {
        const chat = await getChatById(chatId);
        const otherId =
          chat.senderId === currentUserId ? chat.receiverId : chat.senderId;

        const [otherUser, me] = await Promise.all([
          getUserById(otherId),
          getUserById(currentUserId),
        ]);
        setChatUser(otherUser);
        setCurrentUser(me);
      } catch (err) {
        console.error("Error loading users:", err);
      }
    }

    fetchUsers();
  }, [chatId, currentUserId]);


  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!chatId || !input.trim()) return;
    setSending(true);

    try {
      const userMessage = input.trim();
      setInput("");


      await sendMessage(chatId, {
        content: userMessage,
        senderId: currentUserId,
        chatId,
        date: Date.now(),
      });
      inputRef.current?.focus();
    } catch (err) {
      console.error("Send error:", err);
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  }

  return (
    <>

      {/* Desktop */}
      {!isMobile &&
        (
          <div className="d-flex flex-column h-100 p-3 bg-light">
            <div className="border-bottom  p-2 m-0">
              <h5>{chatUser?.username || "Select a chat"}</h5>
            </div>

            <div ref={containerRef} className="flex-grow-1 overflow-auto mb-3 px-2">
              {loading ? (
                <div className="text-center text-muted">
                  <Spinner animation="border" size="sm" /> Loading...
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-muted mt-4">No messages yet.</div>
              ) : (
                messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    sender={
                      msg.senderId === currentUserId
                        ? "Me"
                        : chatUser?.username || "Unknown"
                    }
                    content={msg.content}
                    time={msg.date}
                    avatarUrl={msg.senderId === currentUserId ? currentUser?.avatarUrl : chatUser?.avatarUrl}
                    align={msg.senderId === currentUserId ? "end" : "start"}
                  />

                ))
              )}
            </div>

            <Form onSubmit={handleSend}>
              <InputGroup>
                <Form.Control
                  type="text"

                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="rounded-start-pill"
                />
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!chatId || sending}
                  className="rounded-end-pill"
                >
                  {sending ? "Sending..." : "Send"}
                </Button>
              </InputGroup>
            </Form>
          </div>
        )
      }


      {/* Mobile */}
      {isMobile &&
        (
          <div
            className="d-flex flex-column h-100 bg-light"

            onTouchStart={swipe.onTouchStart}
            onTouchMove={swipe.onTouchMove}
            onTouchEnd={swipe.onTouchEnd}
          >


            {/* Header */}
            <div className="border-bottom p-3 d-flex gap-2">
              <div
                className="d-flex flex-column justify-content-between"
                style={{
                  width: "30px",
                  height: "22px",
                  cursor: "pointer",
                }}
                onClick={swipe.open}
              >
                <span
                  style={{
                    display: "block",
                    height: "4px",
                    borderRadius: "2px",
                    backgroundColor: "#333",
                    transition: "all 0.3s ease",
                    transform: chatList ? "rotate(45deg) translate(5px, 5px)" : "none",
                  }}
                />
                <span
                  style={{
                    display: "block",
                    height: "4px",
                    borderRadius: "2px",
                    backgroundColor: "#333",
                    opacity: chatList ? 0 : 1,
                    transition: "all 0.3s ease",
                  }}
                />
                <span
                  style={{
                    display: "block",
                    height: "4px",
                    borderRadius: "2px",
                    backgroundColor: "#333",
                    transition: "all 0.3s ease",
                    transform: chatList ? "rotate(-45deg) translate(5px, -5px)" : "none",
                  }}
                />
              </div>
              <h5>{chatUser?.username || "Select a chat"}</h5>
            </div>

            {/* Messages container */}
            <div
              ref={containerRef}
              className="flex-grow-1 overflow-auto px-3"

            >
              {loading ? (
                <div className="text-center text-muted mt-3">
                  <Spinner animation="border" size="sm" /> Loading...
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-muted mt-4">No messages yet.</div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id}>
                    <ChatMessage
                      sender={msg.senderId === currentUserId ? "Me" : chatUser?.username || "Unknown"}
                      content={msg.content}
                      time={msg.date}
                      avatarUrl={msg.senderId === currentUserId ? currentUser?.avatarUrl : chatUser?.avatarUrl}
                      align={msg.senderId === currentUserId ? "end" : "start"}
                    />
                  </div>
                ))
              )}
            </div>

            {/* Input pinned at bottom, respects safe area */}
            <div
              className="position-sticky bottom-0 bg-light border-top p-3"
              style={{
                zIndex: 10,
                paddingBottom: "env(safe-area-inset-bottom)", // iOS home indicator safe area
              }}
            >
              <Form onSubmit={handleSend}>
                <InputGroup>
                  <Form.Control
                    type="text"
                    ref={inputRef}
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="rounded-start-pill"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={!chatId || sending}
                    className="rounded-end-pill"
                  >
                    {sending ? "Sending..." : "Send"}
                  </Button>
                </InputGroup>
              </Form>
            </div>
          </div>

        )}
    </>
  );
}
