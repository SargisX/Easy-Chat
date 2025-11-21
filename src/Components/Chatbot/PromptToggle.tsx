import React from "react";

interface PromptToggleTypes {
    label: string;
    active: boolean;
    onToggle: () => void;
    activeColor?: string; // default to green
}

export const PromptToggle: React.FC<PromptToggleTypes> = ({
    label,
    active,
    onToggle,
    activeColor = "#28a745",
}) => {
    return (
        <div className="mb-2 d-flex justify-content-start">
            <div
                onClick={onToggle}
                style={{
                    cursor: "pointer",
                    padding: "6px 14px",
                    borderRadius: "12px",
                    border: active ? `2px solid ${activeColor}` : "2px solid #ccc",
                    background: active ? `${activeColor}25` : "rgba(0,0,0,0.05)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "0.25s",
                    userSelect: "none",
                }}
            >
                <div
                    style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        border: `2px solid ${activeColor}`,
                        background: active ? activeColor : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "0.25s",
                        color: "white",
                        fontSize: "12px",
                    }}
                >
                    {active ? "✔" : ""}
                </div>

                <span style={{ fontSize: "0.9rem" }}>{label}</span>
            </div>
        </div>
    );
};
