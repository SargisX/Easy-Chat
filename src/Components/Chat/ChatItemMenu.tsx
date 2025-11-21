import { Button, Card } from "react-bootstrap";

interface ChatItemMenuProps {
  onDelete?: () => void;
  onClose: () => void;
  containerWidth: number; // width of the chat item
}

export default function ChatItemMenu({ onDelete, onClose, containerWidth }: ChatItemMenuProps) {
  return (
    <Card
      className="position-absolute shadow-sm p-2"
      style={{
        width: containerWidth,
        zIndex: 1000,
        right: 0, // aligns menu with the chat item
      }}
    >
      <Button
        variant="danger"
        size="sm"
        className="w-100 mb-1"
        onClick={() => {
          if (onDelete) onDelete();
          onClose();
        }}
      >
        Delete Chat
      </Button>
      <Button variant="secondary" size="sm" className="w-100" onClick={onClose}>
        Cancel
      </Button>
    </Card>
  );
}
