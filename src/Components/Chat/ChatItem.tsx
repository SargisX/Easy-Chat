import React, { useState, useRef, useEffect } from "react";
import { ListGroup, Image, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import ChatItemMenu from "./ChatItemMenu";
import type { Chat, Message } from "../../types/chat";
import type { User } from "../../types/user";

interface ChatItemProps {
  chat: Chat;
  user: User; // the "other user" in the chat
  lastMessage?: Message;
  onDeleteChat?: (chatId: string) => void;
}

export default function ChatItem({ chat, user, onDeleteChat, lastMessage }: ChatItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [menuWidth, setMenuWidth] = useState(200);

  const location = useLocation();
  const isActive = location.pathname === `/Easy-Chat/chat/${chat.id}`;

  const defAvatar = import.meta.env.VITE_UNKNOWN_USER_IMAGE


  useEffect(() => {
    if (containerRef.current) {
      setMenuWidth(containerRef.current.offsetWidth);
    }
  }, []);

  return (

    <div className="position-relative" ref={containerRef}>
      <Link
        to={`/Easy-Chat/chat/${chat.id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <ListGroup.Item
          className={`d-flex align-items-center gap-3 py-3 px-3 border-0 border-bottom ${isActive ? "bg-light text-dark" : ""
            }`}
          style={{
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
        >

          <Image
            src={user.avatarUrl || defAvatar}
            roundedCircle
            width={48}
            height={48}
            alt={`${user.username} avatar`}
            className="flex-shrink-0"
            style={{ objectFit: "cover" }} // ✅ make image cover the square
          />

          <div className="flex-grow-1 overflow-hidden">
            <strong className="text-truncate d-block">
              {user.displayName || user.username || "Unknown"}
            </strong>
            <small
              className={`text-truncate d-block ${isActive ? "text-dark opacity-75" : "text-muted"
                }`}
              style={{ maxWidth: "90%" }}
            >
              {lastMessage?.content || "No recent message"}
            </small>

          </div>

          <Button
            variant="light"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowMenu((prev) => !prev);
            }}
          >
            ⋮
          </Button>
        </ListGroup.Item>
      </Link>

      {showMenu && (
        <ChatItemMenu
          containerWidth={menuWidth}
          onDelete={
             onDeleteChat
              ? () => onDeleteChat(chat.id)
              : undefined
          }
          onClose={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}
