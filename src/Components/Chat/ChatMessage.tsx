import { useState } from "react";
import ImageViewer from "./ImageViewer";
import { IgnoreSwipe } from "../Features/IgnoreSwipe";
import { parseImageMessage } from "../../utils/imageMessageParser";

interface ChatMessageProps {
  content: string;
  time: number;
  avatarUrl?: string;
  align?: "start" | "end";
  isMobile?: boolean;
  imageUrl?: string;

  // NEW
  onBubbleClick?: (e: React.MouseEvent) => void;
  onBubbleTouch?: (e: React.TouchEvent) => void;
}


export default function ChatMessage({
  content,
  time,
  avatarUrl,
  align = "start",
  isMobile,
  imageUrl,
  onBubbleClick,
}: ChatMessageProps) {
  const formattedTime = new Date(time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isOwnMessage = align === "end";
  const defAvatar = "."+import.meta.env.VITE_UNKNOWN_USER_IMAGE

  const { cleanText, imageUrl: parsedImage } = parseImageMessage(content);
  const finalImage = imageUrl || parsedImage;
  const [viewerImage, setViewerImage] = useState<string | null>(null);



  function parseMessageLinks(content: string) {
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;

    // Split by newlines first
    const lines = content.split("\n");

    return lines.map((line, i) => {
      const parts: React.ReactNode[] = [];
      let lastIndex = 0;

      line.replace(urlRegex, (match, _group, offset) => {
        if (offset > lastIndex) parts.push(line.slice(lastIndex, offset));

        const href = match.startsWith("http") ? match : `https://${match}`;
        parts.push(
          <a
            key={offset}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: isOwnMessage ? "#fff" : "#0d6efd", textDecoration: "underline" }}
            onClick={(e) => e.stopPropagation()}
          >
            {match}
          </a>
        );

        lastIndex = offset + match.length;
        return match;
      });

      if (lastIndex < line.length) parts.push(line.slice(lastIndex));

      // Add a <br> except for the last line
      if (i < lines.length - 1) parts.push(<br key={`br-${i}`} />);
      return parts;
    }).flat();
  }




  const imageStylesDesktop = {
    maxWidth: "250px",
    maxHeight: "300px",
    width: "100%",
    height: "auto",
    borderRadius: "12px",
    marginBottom: "6px",
    cursor: "pointer",
  };

  const imageStylesMobile = {
    maxWidth: "70vw",
    maxHeight: "50vh",
    width: "100%",
    height: "auto",
    borderRadius: "12px",
    marginBottom: "6px",
    cursor: "pointer",
    
  };


  return (
    < >
      {/* Desktop */}
      {!isMobile && (
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
              className={`px-3 py-1 rounded-4 shadow-sm ${isOwnMessage ? " text-white" : "text-dark"}`}
              style={{
                maxWidth: "15vw",
                wordBreak: "break-word",
                fontSize: "1rem",
                lineHeight: "1.3",
                borderBottomRightRadius: isOwnMessage ? "6px" : "1.25rem",
                borderBottomLeftRadius: isOwnMessage ? "1.25rem" : "6px",
                backgroundColor: isOwnMessage ? "#909090" : "#f5f5f5",
              }}
              onClick={onBubbleClick}
            >
              {finalImage && (
                <img
                  src={finalImage}
                  alt="sent image"
                  className="chat-image object-fit-cover mt-2"
                  style={imageStylesDesktop}
                  onClick={() => setViewerImage(finalImage)}
                />
              )}

              <span className="m-2">{parseMessageLinks(cleanText)}</span>
            </div>

          </div>
          <div className={`chat-bubble ${align}`}>
            {imageUrl && (
              <img
                src={imageUrl}
                alt="sent image"
                style={{
                  maxWidth: "250px",
                  borderRadius: "12px",
                  marginBottom: content ? "5px" : "0"
                }}
              />
            )}</div>

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
      )}

      {/* Mobile */}
      {isMobile && (
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
              className={`px-3 py-1 rounded-4 shadow-sm ${isOwnMessage ? " text-light" : "text-dark"}`}
              style={{
                maxWidth: "90%",
                wordBreak: "break-word",
                fontSize: "1rem",
                lineHeight: "1.3",
                borderBottomRightRadius: isOwnMessage ? "6px" : "1.25rem",
                borderBottomLeftRadius: isOwnMessage ? "1.25rem" : "6px",
                backgroundColor: isOwnMessage ? "#909090" : "#f5f5f5",
              }}
              onClick={onBubbleClick}
            >
              {finalImage && (
                <img
                  src={finalImage}
                  alt="sent image"
                  className="chat-image"
                  style={imageStylesMobile}
                  onClick={() => setViewerImage(finalImage)}
                />
              )}

              {parseMessageLinks(cleanText)}
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
      )}

      {viewerImage && (
        <IgnoreSwipe><ImageViewer url={viewerImage} onClose={() => setViewerImage(null)} isMobile={isMobile!} /></IgnoreSwipe>
      )}
    </>
  );
}
