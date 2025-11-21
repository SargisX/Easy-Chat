import { useState } from "react";

interface CodeSnippetProps {
  code: string;
  language: string;
}

export const CodeSnippet: React.FC<CodeSnippetProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{ backgroundColor: "#1e1e1e", borderRadius: "8px", margin: "8px 0", fontFamily: "monospace" }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "4px 8px",
        backgroundColor: "#333",
        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
        color: "#fff",
        fontSize: "0.85rem",
      }}>
        <span>{language}</span>
        <button
          onClick={handleCopy}
          style={{
            background: copied ? "#28a745" : "#555",
            border: "none",
            color: "#fff",
            padding: "2px 8px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "0.75rem",
          }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Code */}
      <pre style={{
        margin: 0,
        padding: "8px",
        color: "#fff",
        overflowX: "auto",
      }}>
        {code}
      </pre>
    </div>
  );
};
