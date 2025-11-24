import { useEffect, useRef, useLayoutEffect, useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { Clipboard, PencilSquare, Trash } from "react-bootstrap-icons";
import { Message } from "../../types/chat";

interface Props {
    visible: boolean;
    x: number;
    y: number;
    onClose: () => void;
    message?: Message | null;
    openDeleteModal: () => void;
    editMessage: (close:boolean) => void;
}

export default function MessageContextMenu({ visible, x, y, onClose, message, openDeleteModal, editMessage }: Props) {
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [pos, setPos] = useState({ top: y, left: x });

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        }
        if (visible) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [visible, onClose]);

    // Recalculate position to fit in viewport
    useLayoutEffect(() => {
        if (!visible || !menuRef.current) return;

        const menu = menuRef.current;
        const { innerWidth: vw, innerHeight: vh } = window;
        const { offsetWidth: w, offsetHeight: h } = menu;

        let newLeft = x;
        let newTop = y;

        // Adjust horizontal
        if (x + w > vw - 10) { // 10px margin from edge
            newLeft = vw - w - 10;
        }
        if (newLeft < 10) newLeft = 10;

        // Adjust vertical
        if (y + h > vh - 10) {
            newTop = vh - h - 10;
        }
        if (newTop < 10) newTop = 10;

        setPos({ top: newTop, left: newLeft });
    }, [x, y, visible]);

    if (!visible) return null;

    function handleCopy(e: React.MouseEvent) {
        e.preventDefault();
        if (!message?.content) return;
        navigator.clipboard.writeText(message.content);
        onClose();
    }

    function handleEdit(e: React.MouseEvent) {
        e.preventDefault();
        editMessage(true)
        onClose();
    }

    async function handleDelete(e: React.MouseEvent) {
        e.preventDefault();
        if (!message?.id) return;
        try {
            openDeleteModal();
            console.log("Delete clicked");
        } catch (err) {
            console.error(err);
        } finally {
            onClose();
        }
    }

    return (
        <div
            ref={menuRef}
            className="position-fixed bg-white shadow rounded"
            style={{
                top: pos.top,
                left: pos.left,
                zIndex: 2000,
                width: "160px",
            }}
        >
            <ListGroup variant="flush">
                <ListGroup.Item action className="d-flex align-items-center gap-2" onClick={handleCopy}>
                    <Clipboard /> Copy
                </ListGroup.Item>
                <ListGroup.Item action className="d-flex align-items-center gap-2" onClick={handleEdit}>
                    <PencilSquare /> Edit
                </ListGroup.Item>
                <ListGroup.Item action className="d-flex align-items-center text-danger gap-2" onClick={handleDelete}>
                    <Trash /> Delete
                </ListGroup.Item>
            </ListGroup>
        </div>
    );
}
