import { ListGroup, Image } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { User } from "../../types/user";
import { Link } from "react-router-dom";
import { useSwipeToggle } from "../../hooks/useSwipeToggle";

interface ChatBotButtonProps {
  user: User;
  closeChatList?: () => void;
  chatList?: boolean
}

const ChatBotButton = ({ user, closeChatList, chatList }: ChatBotButtonProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const bot_id = import.meta.env.VITE_CHATBOT_ID;
  const bot_image = import.meta.env.VITE_CHATBOT_IMAGE;

  const isActive = location.pathname.includes(bot_id);

  const swipe = useSwipeToggle({
    isOpen: chatList!,
    setOpen: closeChatList!
  });

  return (
    <div className="position-relative" onClick={swipe.close}>
      <Link
        to={`/Easy-Chat/${bot_id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <ListGroup.Item
          onClick={() => navigate(`/Easy-Chat/chat/${bot_id}`)}
          className={`d-flex align-items-center gap-3 py-3 px-3 border-0 border-bottom ${isActive ? "bg-light text-dark" : ""
            }`}
          style={{
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
        >
          <Image
            src={bot_image}
            roundedCircle
            width={48}
            height={48}
            alt={`${user.username} avatar`}
            style={{ objectFit: "cover" }}
          />

          <div className="flex-grow-1 overflow-hidden">
            <strong className="text-truncate d-block">
              AI Chatbot
            </strong>

            <small
              className={`text-truncate d-block ${isActive ? "text-dark opacity-75" : "text-muted"
                }`}
            >
              Start exploring new features of our AI model
            </small>
          </div>
        </ListGroup.Item>
      </Link>
    </div>
  );
};

export default ChatBotButton;
