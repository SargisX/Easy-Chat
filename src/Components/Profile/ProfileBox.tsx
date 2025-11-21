import { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "../../types/user";
import { InfoCircle, XCircle } from "react-bootstrap-icons";

interface ProfileBoxProps {
  user: User;
  onInfoClick?: () => void;
}

export default function ProfileBox({ user, onInfoClick }: ProfileBoxProps) {
  const [expanded, setExpanded] = useState(false);
  const defAvatar = import.meta.env.VITE_UNKNOWN_USER_IMAGE

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 220, damping: 25 }}
      className="my-1"
    >
      <Card
        className={`border-0 shadow-sm rounded-4 overflow-hidden position-relative ${
          expanded ? "p-3 bg-gradient" : "p-2 bg-white"
        }`}
        style={{
          cursor: "pointer",
          height: expanded ? 260 : 90,
          background: expanded
            ? "linear-gradient(145deg, #f7f9fc, #e3e9f2)"
            : "white",
          transition: "all 0.3s ease",
          boxShadow: expanded
            ? "0 6px 16px rgba(0,0,0,0.12)"
            : "0 2px 6px rgba(0,0,0,0.05)",
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="d-flex align-items-center">
          <motion.img
            layout
            src={user.avatarUrl || defAvatar}
            alt={user.username}
            style={{
              width: expanded ? 90 : 55,
              height: expanded ? 90 : 55,
              borderRadius: "50%",
              objectFit: "cover",
              transition: "all 0.3s ease",
              boxShadow: expanded
                ? "0 4px 12px rgba(0,0,0,0.15)"
                : "0 2px 5px rgba(0,0,0,0.1)",
            }}
          />

          <div className="ms-3 flex-grow-1">
            <h5 className="mb-1 fw-semibold">
              {user.displayName || user.username}
            </h5>
            {user.status && (
              <span
                className={`badge rounded-pill ${
                  user.status === "online"
                    ? "bg-success"
                    : user.status === "away"
                    ? "bg-warning text-dark"
                    : "bg-secondary"
                }`}
              >
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </span>
            )}
            <AnimatePresence>
              {expanded && user.bio && (
                <motion.p
                  key="info"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-muted small mt-2"
                >
                  {user.bio}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              key="buttons"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.3 }}
              className="mt-3 d-flex flex-column gap-2"
            >
              {/* Full-width Info button with primary border */}
              <Button
                variant="outline-info"
                className="w-100 rounded-pill py-2 d-flex align-items-center justify-content-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onInfoClick?.();
                }}
              >
                <InfoCircle size={18} />
                Info
              </Button>

              {/* Full-width Close button */}
              <Button
                variant="outline-dark"
                className="w-100 border rounded-pill py-2 d-flex align-items-center justify-content-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(false);
                }}
              >
                <XCircle size={18} />
                Close
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
