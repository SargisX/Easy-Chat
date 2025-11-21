import { useState, useRef, useEffect } from "react";
import { ListGroup, Image, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import ChatItemMenu from "./ChatItemMenu";
import type { Chat, Message } from "../../types/chat";
import type { User } from "../../types/user";
import styles from "../../Styles/ChatItem.module.css"
import { useSwipeToggle } from "../../hooks/useSwipeToggle";


interface ChatItemProps {
  chat: Chat;
  user: User; // the "other user" in the chat
  lastMessage?: Message;
  onDeleteChat?: (chatId: string) => void;
  closeChatList?: () => void;
  chatList?: boolean
}



export default function ChatItem({ chat, user, onDeleteChat, lastMessage, closeChatList,chatList }: ChatItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [menuWidth, setMenuWidth] = useState(200);

  const location = useLocation();
  const isActive = location.pathname === `/Easy-Chat/chat/${chat.id}`;

  const defAvatar = import.meta.env.VITE_UNKNOWN_USER_IMAGE

  const swipe = useSwipeToggle({
    isOpen: chatList!,
    setOpen: closeChatList!
  });


  useEffect(() => {
    if (containerRef.current) {
      setMenuWidth(containerRef.current.offsetWidth);
    }
  }, []);


  return (

    <div className="position-relative" ref={containerRef} onClick={swipe.close} >
      <Link
        to={`/Easy-Chat/chat/${chat.id}`}
        style={{ textDecoration: "none", color: "inherit" }}
        
      >
        <ListGroup.Item
          className={`d-flex align-items-center gap-3 py-3 px-3 border-0 border-bottom ${styles.chatItem} ${isActive ? `${styles.active}` : ''}`}
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
