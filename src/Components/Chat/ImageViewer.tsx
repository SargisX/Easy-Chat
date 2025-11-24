export default function ImageViewer({ url, onClose, isMobile }: { url: string, onClose: () => void, isMobile: boolean }) {
    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.9)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
            }}
        >
            <img
                src={url}
                alt="Full screen"
                style={{
                    maxWidth: isMobile ? "95vw" : "85vw",
                    maxHeight: isMobile ? "70vh" : "85vh",
                    width: "auto",
                    height: isMobile ?"50%": "85%",
                    objectFit: "contain",  // keeps full image visible
                    borderRadius: "12px",
                }}
            />
        </div>
    );
}
