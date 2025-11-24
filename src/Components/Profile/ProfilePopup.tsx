// ProfilePopup.tsx
import { motion } from "framer-motion";
import { Button } from "react-bootstrap";
import { useState } from "react";
import { User, UserStatus } from "../../types/user";
import { InfoBox } from "./InfoBox";
import { deleteUserById, logout, updateUserStatus } from "../../API/usersApi";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface ProfilePopupProps {
  user: User;
  onClose: () => void;
  onEdit: () => void;
  isMobile?: boolean
}

export default function ProfilePopup({ user, onClose, onEdit, isMobile }: ProfilePopupProps) {
  const defAvatar = import.meta.env.VITE_UNKNOWN_USER_IMAGE;
  const [openBox, setOpenBox] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();

  // Optional: handle logout click
  const handleLogout = () => {
    updateUserStatus(user.id, UserStatus.OFFLINE);
    onClose();
    logout(); // call imported logout function
    navigate("/");
    // close popup after logout
  };

  const handleDeleteUser = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    await updateUserStatus(user.id, UserStatus.OFFLINE);
    logout();
    await deleteUserById(user.id);       // your delete API
    navigate("/");
  };


  return (
    <>
      {/* Desktop */}
      {!isMobile && (
        <motion.div
          className="position-absolute top-0 start-0 w-100 h-100 bg-light d-flex flex-column"
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ duration: 0.3 }}
          style={{ zIndex: 1050 }}
        >
          {/* Header */}
          <div className="d-flex align-items-center justify-content-between p-3 border-bottom bg-white shadow-sm">
            <h5 className="mb-0">{user.displayName || user.username}</h5>
            <Button variant="outline-secondary" size="sm" onClick={onClose}>
              ►
            </Button>
          </div>

          {/* Profile Content */}
          <div className="flex-grow-1 overflow-auto p-4 d-flex flex-column align-items-center">
            {/* Avatar */}
            <img
              src={user.avatarUrl || defAvatar}
              alt={user.username}
              className="rounded-circle border border-light shadow mb-4"
              style={{ width: 140, height: 140, objectFit: "cover" }}
            />

            {/* Boxes container */}
            <div className="w-100" style={{ maxWidth: 400 }}>
              {/* About Box */}
              <InfoBox
                title="About"
                isOpen={openBox === "about"}
                onHover={() => setOpenBox("about")}
                onClick={openBox === "about" ? () => setOpenBox(null) : undefined}
              >
                <div className="p-3 border rounded shadow-sm bg-white">
                  <p><strong>Display Name:</strong> {user.displayName || "Not set"}</p>
                  <p><strong>Username:</strong> @{user.username || "Not set"}</p>
                  {user.bio && <p><strong>Bio:</strong> {user.bio}</p>}
                </div>
              </InfoBox>

              {/* Settings Box */}
              <InfoBox
                title="Settings"
                isOpen={openBox === "settings"}
                onHover={() => setOpenBox("settings")}
                onClick={openBox === "settings" ? () => setOpenBox(null) : undefined}
              >
                <div className="d-flex flex-column gap-3">
                  <Button variant="primary" className="w-100 text-white" onClick={onEdit}>
                    Edit Profile
                  </Button>

                  {/* Logout Button */}
                  <Button variant="danger" className="w-100 text-white" onClick={handleLogout}>
                    Logout
                  </Button>

                  <Button variant="warning" className="w-100 text-white" onClick={handleDeleteUser}>
                    Delete Account
                  </Button>
                </div>
              </InfoBox>
            </div>
          </div>
        </motion.div>
      )}

      {/* Mobile */}
      {isMobile && (
        <motion.div
          className="position-absolute top-0 start-0 w-100 h-100 bg-light d-flex flex-column"
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ duration: 0.3 }}
          style={{ zIndex: 1050 }}
        >
          {/* Header */}
          <div className="d-flex align-items-center justify-content-between p-3 border-bottom bg-white shadow-sm">
            <h5 className="mb-0">{user.displayName || user.username}</h5>
            <Button variant="outline-secondary" size="sm" onClick={onClose}>
              ►
            </Button>
          </div>

          {/* Profile Content */}
          <div className="flex-grow-1 overflow-auto p-4 d-flex flex-column align-items-center">
            {/* Avatar */}
            <img
              src={user.avatarUrl || defAvatar}
              alt={user.username}
              className="rounded-circle border border-light shadow mb-4"
              style={{ width: 140, height: 140, objectFit: "cover" }}
            />

            {/* Boxes container */}
            <div className="w-100" style={{ maxWidth: 400 }}>
              {/* About Box */}
              <InfoBox
                title="About"
                isOpen={openBox === "about"}
                onHover={() => setOpenBox("about")}
                onClick={openBox === "about" ? () => setOpenBox(null) : undefined}
              >
                <p><strong>Display Name:</strong> {user.displayName || "Not set"}</p>
                <p><strong>Username:</strong> @{user.username || "Not set"}</p>
                {user.bio && <p><strong>Bio:</strong> {user.bio}</p>}
              </InfoBox>

              {/* Settings Box */}
              <InfoBox

                title="Settings"
                isOpen={openBox === "settings"}
                onHover={() => setOpenBox("settings")}
                onClick={openBox === "settings" ? () => setOpenBox(null) : undefined}
              >
                <div className="d-flex flex-column gap-3">
                  <Button variant="primary" className="w-100 text-white" onClick={onEdit}>
                    Edit Profile
                  </Button>

                  {/* Logout Button */}
                  <Button variant="danger" className="w-100 text-white" onClick={handleLogout}>
                    Logout
                  </Button>

                  <Button variant="warning" className="w-100 text-white" onClick={handleDeleteUser}>
                    Delete Account
                  </Button>
                </div>
              </InfoBox>
            </div>
          </div>
        </motion.div>
      )}

      <ConfirmDeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />

    </>
  );
}
