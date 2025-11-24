import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Form, InputGroup, Button, Spinner } from "react-bootstrap";
import { getUserById } from "../../API/usersApi";
import ChatMessage from "./ChatMessage";
import { useChatMessages } from "../../hooks/useChatMessages";
import { useSwipeToggle } from "../../hooks/useSwipeToggle";
import { User } from "../../types/user";
import MessageContextMenu from "./MessageContextMenu";
import { Message } from "../../types/chat";
import DeleteConfirmPopup from "./DeleteConfirmPopup";
import EditingMessageBanner from "./EditingMessageBanner";
import { IgnoreSwipe } from "../Features/IgnoreSwipe";
import { cloudinaryFolder, uploadToCloudinary } from "../../utils/CloudinaryFunctions";
import ImagePreview from "./ImagePreview";
import { compressImage } from "../../utils/compressImage";
import { FiImage } from "react-icons/fi";



interface WindowType {
  openChatList?: (open: boolean) => void
  chatList?: any
  isMobile?: boolean
}

export default function ChatWindow({ isMobile, openChatList, chatList }: WindowType) {
  const params = useParams<{ id?: string; chatId?: string }>();
  const chatId = params.chatId || params.id || "";
  const currentUserId = localStorage.getItem("userId") || "";

  const [chatUser, setChatUser] = useState<User>({} as User);
  const [currentUser, setCurrentUser] = useState<User>({} as User);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const editableRef = useRef<HTMLDivElement | null>(null);

  const { messages, containerRef, loading, sendMessage, removeMessage, updateMessage, chatInfo } =
    useChatMessages(chatId);


  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState<boolean>(false);
  const [editingMessage, setEditingMessage] = useState<boolean>(false);


  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState(false);


  const defaultUser: User = {
    id: "",
    username: "Unknown",
    displayName: "Unknown",
    avatarUrl: import.meta.env.VITE_UNKNOWN_USER_IMAGE || "/default-avatar.png",
    password: "",
    bio: "",
  };

  const displayChatUser = loadingUsers ? defaultUser : chatUser;
  const displayCurrentUser = loadingUsers ? defaultUser : currentUser;



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
    if (!chatInfo || !currentUserId) return;

    const otherId = chatInfo.senderId === currentUserId ? chatInfo.receiverId : chatInfo.senderId;

    let mounted = true;

    async function fetchUsers() {
      setLoadingUsers(true);
      try {
        const [otherUser, me] = await Promise.all([
          getUserById(otherId),
          getUserById(currentUserId),
        ]);
        if (!mounted) return;

        setChatUser(otherUser);
        setCurrentUser(me);
      } catch (err) {
        console.error("Failed to load users:", err);
      } finally {
        if (mounted) setLoadingUsers(false);
      }
    }

    fetchUsers();

    return () => {
      mounted = false;
    };
  }, [chatInfo, currentUserId]);



  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!chatId || !input.trim()) return;
    setSending(true);

    try {
      let userMessage = input.trim();
      setInput("");
      if (editingMessage && selectedMessage) {

        // Update existing message
        updateMessage(selectedMessage.id, userMessage);

        setEditingMessage(false); // exit editing mode
        setSelectedMessage(null); // clear selected
      } else {
        // Normal send
        if (photoPreview && selectedFile) {
          const compressed = await compressImage(selectedFile);
          const cloudUrl = await uploadToCloudinary(compressed, cloudinaryFolder.Chat_Images);
          // add $$$URL$$$ at the end
          userMessage += ` |$|${cloudUrl}|$|`;
          setPhotoPreview(false);
          setSelectedFile(null);
        }
        inputRef.current?.focus();
        await sendMessage(chatId, {
          content: userMessage,
          senderId: currentUserId,
          chatId,
          date: Date.now(),
        });

      }

      setInput(""); // clear input

      const textarea = document.querySelector("#chat-textarea") as HTMLTextAreaElement;
      if (textarea) {
        textarea.style.height = "35px";
        textarea.style.borderTopLeftRadius = "0";
        textarea.style.borderBottomLeftRadius = "0";
        textarea.style.borderTopRightRadius = "0";
        textarea.style.borderBottomRightRadius = "0";
      }
    } catch (err) {
      console.error("Send error:", err);
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  }

  // When entering edit mode, load message into input
  useEffect(() => {
    if (editingMessage && selectedMessage) {
      setInput(selectedMessage.content);
      inputRef.current?.focus();

    }
    if (!editingMessage) setInput(""); // clear input


  }, [editingMessage, selectedMessage]);
  // When entering edit mode, load message into input
  useEffect(() => {
    if (editableRef.current && selectedMessage) {
      setEditingMessage(false);
    }


  }, [editableRef, selectedMessage]);


  // Desktop
  function handleMessageClick(e: React.MouseEvent, message: Message) {
    e.preventDefault();
    setMenuPos({ x: e.clientX, y: e.clientY });
    setSelectedMessage(message); // store full message instead of ID
    setMenuVisible(true);
  }

  function isMyMessage(msg: any) {
    return msg.senderId === currentUserId;
  }

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPhotoPreview(true);

    e.target.value = "";
  }




  return (
    <>

      {/* Desktop */}
      {!isMobile &&
        (
          <div className="d-flex flex-column h-100 py-2 ">
            <div className="border-bottom p-3 m-0">
              <div className="d-flex flex-row p-0 align-items-center gap-2 " style={{ fontSize: '1.3rem ' }}>
                <span>{displayChatUser.username || "Select a chat"}</span>

                {chatUser.status && (
                  <span
                    style={{ fontSize: "0.8rem" }}
                    className={`badge rounded-pill  ${chatUser.status === "online"
                      ? "bg-success"
                      : chatUser.status === "away"
                        ? "bg-warning text-dark"
                        : "bg-secondary"
                      }`}
                  >
                    {chatUser.status.charAt(0).toUpperCase() + chatUser.status.slice(1)}
                  </span>
                )}
              </div>
            </div>

            <div ref={containerRef} className="flex-grow-1 overflow-auto mt-3 px-2">
              {loading ? (
                <div className="text-center text-muted">
                  <Spinner animation="border" size="sm" /> Loading...
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-muted mt-4">No messages yet.</div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                  >
                    <ChatMessage
                      content={msg.content}
                      time={msg.date}
                      avatarUrl={msg.senderId === currentUserId ? displayCurrentUser.avatarUrl! : displayChatUser.avatarUrl!}
                      align={msg.senderId === currentUserId ? "end" : "start"}
                      isMobile={isMobile}
                      onBubbleClick={(e) => {
                        if (!isMyMessage(msg)) return;
                        handleMessageClick(e, msg);
                      }}
                    />
                  </div>

                ))
              )}
            </div>

            <div ref={editableRef} style={{ background: "transparent", backdropFilter: "blur(10px)" }}>
              {editingMessage && selectedMessage && (
                <EditingMessageBanner
                  isMobile={isMobile!}
                  message={selectedMessage}
                  onCancel={() => setEditingMessage(false)}
                />
              )}
              {photoPreview && selectedFile && (
                <ImagePreview
                  file={selectedFile}
                  onCancel={() => {
                    setPhotoPreview(false);
                    setSelectedFile(null);
                  }}
                />
              )}

              <Form onSubmit={handleSend} className="mx-2 " >
                <InputGroup style={{ alignItems: "flex-end" }} >
                  <Button
                    variant="primary"
                    className="rounded-start-pill d-flex align-items-center justify-content-center"
                    onClick={() => document.getElementById("image-input")?.click()}
                  >
                    <FiImage size={22} />
                  </Button>

                  <input
                    id="image-input"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageSelect}
                  />

                  <Form.Control
                    id="chat-textarea"
                    as="textarea"
                    rows={1}
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={{
                      resize: "none",
                      overflow: "hidden",
                      minHeight: "35px",
                      maxHeight: "250px",
                      borderTopLeftRadius: "0",
                      borderBottomLeftRadius: "0",
                      borderTopRightRadius: "0",
                      borderBottomRightRadius: "0",
                      transition: "border-radius 0s, height 0.2s",
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = "auto";
                      const newHeight = Math.max(target.scrollHeight, 35);
                      target.style.height = newHeight + "px";

                      if (newHeight > 50) {
                        target.style.borderTopLeftRadius = "20px";
                        target.style.borderBottomLeftRadius = "0";
                        target.style.borderTopRightRadius = "20px";
                        target.style.borderBottomRightRadius = "0";
                      } else {
                        target.style.borderTopLeftRadius = "0";
                        target.style.borderBottomLeftRadius = "0";
                        target.style.borderTopRightRadius = "0";
                        target.style.borderBottomRightRadius = "0";
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        handleSend(e);
                        setInput((prev) => prev + "\n");
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    style={{ height: "fit-content" }}
                    disabled={!chatId || sending}
                    className="rounded-end-pill"
                  >
                    {sending ? "Sending..." : editingMessage ? "Update" : "Send"}
                  </Button>
                </InputGroup>
              </Form>
            </div>

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
            <div className="border-bottom p-3 d-flex flex-row gap-2 bg-light">
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
              <div className="d-flex flex-row p-0 align-items-center gap-2 " style={{ fontSize: '1.2rem ' }} >
                <span>{displayChatUser?.username || "Select a chat"}</span>
                {chatUser.status && (
                  <span
                    style={{ fontSize: "1rem" }}
                    className={`badge rounded-pill text-xl-start  ${chatUser.status === "online"
                      ? "bg-success"
                      : chatUser.status === "away"
                        ? "bg-warning text-dark"
                        : "bg-secondary"
                      }`}
                  >
                    {chatUser.status.charAt(0).toUpperCase() + chatUser.status.slice(1)}
                  </span>
                )}
              </div>
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
                  <div
                    key={msg.id}
                  >
                    <ChatMessage
                      content={msg.content}
                      time={msg.date}
                      avatarUrl={msg.senderId === currentUserId ? displayCurrentUser.avatarUrl! : displayChatUser.avatarUrl!}
                      align={msg.senderId === currentUserId ? "end" : "start"}
                      isMobile={isMobile}
                      onBubbleClick={(e) => {
                        if (!isMyMessage(msg)) return;
                        handleMessageClick(e, msg);
                      }}
                    />

                  </div>
                ))
              )}
            </div>

            {/* Input pinned at bottom, respects safe area */}
            <IgnoreSwipe>
              <div
                ref={editableRef}
                className="position-sticky bottom-0 bg-light border-top p-3"
                style={{
                  zIndex: 10,
                  paddingBottom: "env(safe-area-inset-bottom)"
                }}
              >
                {editingMessage && selectedMessage && (
                  <EditingMessageBanner
                    isMobile={isMobile}
                    message={selectedMessage}
                    onCancel={() => setEditingMessage(false)}
                  />
                )}
                {photoPreview && selectedFile && (
                  <ImagePreview
                    file={selectedFile}
                    onCancel={() => {
                      setPhotoPreview(false);
                      setSelectedFile(null);
                    }}
                  />
                )}
                <Form onSubmit={handleSend}>
                  <InputGroup style={{ alignItems: "flex-end" }}>
                    <Button
                      variant="primary"
                      className="rounded-start-pill d-flex align-items-center justify-content-center"
                      onClick={() => document.getElementById("image-input")?.click()}
                    >
                      <FiImage size={22} />
                    </Button>

                    
                  <input
                    id="image-input"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageSelect}
                  />
                    <Form.Control
                      id="chat-textarea"
                      as="textarea"
                      ref={inputRef}
                      rows={1}
                      placeholder="Type a message..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      style={{
                        resize: "none",
                        overflow: "hidden",
                        minHeight: "35px",
                        maxHeight: "250px",
                        borderTopLeftRadius: "0",
                        borderBottomLeftRadius: "0",
                        borderTopRightRadius: "0",
                        borderBottomRightRadius: "0",
                        transition: "border-radius 0.2s, height 0.2s",
                        boxSizing: "border-box",
                      }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;

                        requestAnimationFrame(() => {
                          target.style.height = "auto";
                          const newHeight = Math.min(Math.max(target.scrollHeight, 35), 250);
                          target.style.height = newHeight + "px";

                          // Adjust border-radius
                          const threshold = 60; // slightly bigger for mobile
                          if (newHeight > threshold) {
                            target.style.borderTopLeftRadius = "15px";
                            target.style.borderBottomLeftRadius = "0";
                            target.style.borderTopRightRadius = "15px";
                            target.style.borderBottomRightRadius = "0";
                          } else {
                            target.style.borderTopLeftRadius = "0";
                            target.style.borderBottomLeftRadius = "0";
                            target.style.borderTopRightRadius = "0";
                            target.style.borderBottomRightRadius = "0";
                          }
                        });

                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setInput((prev) => prev + "\n"); // always insert newline
                          setTimeout(() => {
                            if (inputRef.current) {
                              inputRef.current.selectionStart = inputRef.current.selectionEnd = inputRef.current.value.length;
                            }
                          }, 0);
                        }
                      }}
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      className="rounded-end-pill"
                      style={{ height: "fit-content" }}
                      disabled={!chatId || sending}
                    >
                      {sending ? "Sending..." : editingMessage ? "Update" : "Send"}
                    </Button>
                  </InputGroup>
                </Form>
              </div>
            </IgnoreSwipe>
          </div>

        )}

      <MessageContextMenu
        visible={menuVisible}
        x={menuPos.x}
        y={menuPos.y}
        onClose={() => setMenuVisible(false)}
        message={selectedMessage}
        openDeleteModal={() => setDeleteConfirmVisible(true)}  // <-- new prop
        editMessage={setEditingMessage}
      />
      <DeleteConfirmPopup
        visible={deleteConfirmVisible}
        parentRef={containerRef as React.RefObject<HTMLElement>}
        onConfirm={() => {
          if (selectedMessage) removeMessage(selectedMessage.id);
          setDeleteConfirmVisible(false);
        }}
        onCancel={() => setDeleteConfirmVisible(false)}
      />


    </>
  );
}
