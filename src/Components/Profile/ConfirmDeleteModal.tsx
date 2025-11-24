// ConfirmDeleteModal.tsx
import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface ConfirmDeleteModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function ConfirmDeleteModal({
  show,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) {
  const REQUIRED_TEXT = "EasyChat_DeleteAccount";
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (input !== REQUIRED_TEXT) {
      setError("Incorrect text. Please type: "+REQUIRED_TEXT);
      return;
    }

    setError("");
    await onConfirm();
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete Account</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="text-danger fw-bold">
          Are you sure you want to delete your account?
        </p>
        <p>This action is permanent and cannot be undone.</p>

        <p className="mb-2">
          To confirm, type: <strong>{REQUIRED_TEXT}</strong>
        </p>

        <Form.Control
          type="text"
          placeholder="Enter confirmation text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {error && <p className="text-danger mt-2">{error}</p>}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>

        <Button variant="danger" onClick={handleSubmit}>
          Delete Account
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
