
interface ChatMessageProps {
  sender: string;
  content: string;
  time: number; // timestamp in ms
  avatarUrl?: string;
  align?: "start" | "end";
}

export default function ChatMessage({
  content,
  time,
  avatarUrl,
  align = "start",
}: ChatMessageProps) {
  const formattedTime = new Date(time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isOwnMessage = align === "end";
  const defAvatar = import.meta.env.VITE_UNKNOWN_USER_IMAGE

  return (
    <div
      className={`d-flex flex-column mb-3 ${isOwnMessage ? "align-items-end" : "align-items-start"
        }`}
    >
      <div
        className={`d-flex align-items-end ${isOwnMessage ? "flex-row-reverse" : "flex-row"
          }`}
        style={{ gap: "10px" }}
      >
        {/* ✅ Avatar (slightly larger) */}
        <img
          src={avatarUrl || defAvatar}
          alt="avatar"
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            objectFit: "cover",
            border: "1px solid #ccc",
          }}
        />

        {/* ✅ Message bubble (slimmer vertically) */}
        <div
          className={`px-3 py-1 rounded-4 shadow-sm ${isOwnMessage ? "bg-primary text-white" : "bg-light"
            }`}
          style={{
            maxWidth: "75%",
            wordBreak: "break-word",
            fontSize: "1rem",
            lineHeight: "1.3",
            borderBottomRightRadius: isOwnMessage ? "6px" : "1.25rem",
            borderBottomLeftRadius: isOwnMessage ? "1.25rem" : "6px",
          }}
        >
          {content}
        </div>
      </div>

      {/* ✅ Timestamp below bubble */}
      <small
        className={`mt-1 text-${isOwnMessage ? "muted text-end" : "muted text-start"}`}
        style={{
          fontSize: "0.8rem",
          opacity: 0.75,
        }}
      >
        {formattedTime}
      </small>
    </div>
  );
}
