
interface ConfirmationModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
}

export default function ConfirmationModal({
  show,
  onClose,
  onConfirm,
  message = "Are you sure?",
}: ConfirmationModalProps) {
  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
      onClick={onClose} // close when clicking outside
    >
      <div
        style={{
          width: 300,       // fixed width
          padding: 20,
          backgroundColor: "white",
          borderRadius: 8,
          boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
        }}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <p className="mb-4 text-center">{message}</p>
        <div className="d-flex justify-content-between">
          <button className="btn btn-secondary" onClick={onClose}>
            No
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
