// src/components/Chat/EditingMessageBanner.tsx
import { XCircle, PencilSquare } from "react-bootstrap-icons";
import { Button } from "react-bootstrap";
import { Message } from "../../types/chat";

interface Props {
    isMobile: boolean;
    message: Message;
    onCancel: () => void;
}

// Helper — truncate string and apply fading “...”
function truncateWithFade(text: string, limit: number) {
    if (text.length <= limit) {
        return { visible: text, truncated: "" };
    }

    return {
        visible: text.slice(0, limit),
        truncated: "..."
    };
}

export default function EditingMessageBanner({ message, isMobile, onCancel }: Props) {
    const previewPC = truncateWithFade(message.content, 15);
    const previewMobile = truncateWithFade(message.content, 5);

    // 👉 use isMobile everywhere
    const preview = isMobile ? previewMobile : previewPC;

    return (
        <div
            className="d-flex align-items-center justify-content-between p-2 mx-2 my-1 rounded bg-light border border-secondary flex-wrap"
            style={{ maxWidth: isMobile ? '75%' : '25%', minWidth: '200px', wordBreak: 'break-word' }}
        >
            {/* LEFT SIDE */}
            <div className="d-flex align-items-center gap-2 flex-grow-1 flex-wrap">
                <PencilSquare className="text-secondary" size={18} />

                <span
                    className="text-muted"
                    style={{
                        fontSize: "0.9rem",
                        display: "inline-flex",
                        alignItems: "center",
                        maxWidth: "100%",
                    }}
                >
                    Editing message:{" "}
                    <strong
                        className="text-dark ms-1"
                        style={{
                            position: "relative",
                            display: "inline-block",
                            maxWidth: "100%",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {/* VISIBLE PART */}
                        {preview.visible}

                        {/* FADED TRUNCATED PART */}
                        {preview.truncated && (
                            <span
                                style={{
                                    background: "linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0))",
                                    WebkitBackgroundClip: "text",
                                    color: "transparent",
                                }}
                            >
                                {preview.truncated}
                            </span>
                        )}
                    </strong>
                </span>
            </div>

            {/* RIGHT SIDE BUTTON */}
            <Button
                variant="outline-secondary"
                size="sm"
                onClick={onCancel}
                className="mt-1 mt-sm-0"
            >
                <XCircle /> Cancel
            </Button>
        </div>
    );
}
