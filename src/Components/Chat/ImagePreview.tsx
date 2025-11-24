import { Button } from "react-bootstrap";

interface ImagePreviewProps {
  file: File;
  onCancel: () => void;
}

export default function ImagePreview({ file, onCancel }: ImagePreviewProps) {
  const previewUrl = URL.createObjectURL(file);

  return (
    <div
      style={{
        padding: "10px",
        background: "#f7f7f7",
        borderTop: "1px solid #ddd",
        display: "flex",
        gap: "10px",
        alignItems: "center",
      }}
    >
      <img
        src={previewUrl}
        alt="preview"
        style={{
          width: 80,
          height: 80,
          borderRadius: 10,
          objectFit: "cover",
        }}
      />

      <div className="d-flex flex-column">
        <span style={{ fontSize: "0.9rem" }}>{file.name}</span>
        <Button
          size="sm"
          variant="outline-danger"
          onClick={onCancel}
          style={{ marginTop: 5 }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
