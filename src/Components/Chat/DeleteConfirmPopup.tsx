// src/components/Chat/DeleteConfirmPopup.tsx
import { useEffect, useRef, useLayoutEffect, useState } from "react";
import { Button } from "react-bootstrap";

interface Props {
  visible: boolean;
  parentRef: React.RefObject<HTMLElement>; // center relative to this container
  onConfirm: () => void;
  onCancel: () => void;
  message?: string;
}

export default function DeleteConfirmPopup({
  visible,
  parentRef,
  onConfirm,
  onCancel,
  message = "Are you sure you want to delete this?",
}: Props) {
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onCancel();
      }
    }
    if (visible) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [visible, onCancel]);

  // Center inside parent
  useLayoutEffect(() => {
    if (!visible || !popupRef.current || !parentRef.current) return;

    const parentRect = parentRef.current.getBoundingClientRect();
    const popupRect = popupRef.current.getBoundingClientRect();

    const newLeft = parentRect.left + parentRect.width / 2 - popupRect.width / 2;
    const newTop = parentRect.top + parentRect.height / 2 - popupRect.height / 2;

    setPos({ top: newTop, left: newLeft });
  }, [visible, parentRef]);

  if (!visible) return null;

  return (
    <div
      ref={popupRef}
      className="position-fixed bg-white shadow rounded p-3"
      style={{
        width: "240px",
        zIndex: 3000,
        top: pos.top,
        left: pos.left,
        textAlign: "center",
      }}
    >
      <p style={{ marginBottom: "1rem" }}>{message}</p>
      <div className="d-flex justify-content-between">
        <Button variant="secondary" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" size="sm" onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </div>
  );
}
