import { useEffect } from "react";

interface ChatContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
    onDelete: () => void; // add this
  }
  
  export default function ChatContextMenu({ x, y, onClose, onDelete }: ChatContextMenuProps) {
    useEffect(() => {
      const handleClickOutside = () => onClose();
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }, [onClose]);
  
    return (
      <div
        style={{
          position: "absolute",
          top: y,
          left: x,
          width: 150,
          height: 50,
          backgroundColor: "white",
          border: "1px solid #ccc",
          borderRadius: 4,
          padding: 8,
          zIndex: 1000,
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button className="btn btn-sm btn-danger w-100" onClick={onDelete}>
          Delete Chat
        </button>
      </div>
    );
  }
  