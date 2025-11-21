import { useState, ChangeEvent, useContext } from "react";
import { motion } from "framer-motion";
import { Button, Form } from "react-bootstrap";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";
import { EditUser, User } from "../../types/user";
import { updateUserProfile } from "../../API/usersApi";
import { ChatContext } from "../../context/chatContext";
import { ActionTypes } from "../../context/types";
import { compressImage } from "../../utils/compressImage";

interface ProfileEditPanelProps {
  user: User;
  onClose: () => void;
}

export default function ProfileEditPanel({ user, onClose }: ProfileEditPanelProps) {
  const ctx = useContext(ChatContext);
  const { dispatch } = ctx!;

  const [form, setForm] = useState<EditUser>({
    username: user.username || "",
    displayName: user.displayName || "",
    bio: user.bio || "",
  });

  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const defAvatar = import.meta.env.VITE_UNKNOWN_USER_IMAGE

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let avatarUrl = user.avatarUrl;

      // ✅ Upload avatar to Cloudinary if new
      if (avatar) {
        const compressed = await compressImage(avatar);
        avatarUrl = await uploadToCloudinary(compressed);
      }
      

      // ✅ Update backend
      const updatedUser = await updateUserProfile(user.id, {
        username: form.username,
        displayName: form.displayName,
        bio: form.bio,
        avatarUrl,
      });

      // ✅ Update frontend immediately (context reducer)
      dispatch({
        type: ActionTypes.UPDATE_USER,
        payload: updatedUser,
      });

      // Optional: also update localStorage if you're storing current user
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      alert("Profile updated successfully!");
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="position-absolute top-0 start-0 w-100 h-100 bg-white d-flex flex-column p-3"
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ duration: 0.3 }}
      style={{ zIndex: 1050 }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Edit Profile</h5>
        <Button variant="outline-secondary" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>

      <div className="d-flex flex-column align-items-center">
        <label htmlFor="avatar-upload" style={{ cursor: "pointer" }}>
          <img
            src={avatar ? URL.createObjectURL(avatar) : user.avatarUrl || defAvatar}
            alt={user.username}
            className="rounded-circle mb-3"
            style={{ width: 120, height: 120, objectFit: "cover" }}
          />
        </label>
        <input
          type="file"
          id="avatar-upload"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleAvatarChange}
        />
      </div>

      <Form onSubmit={handleSubmit} className="w-100 mt-3">
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            name="displayName"
            value={form.displayName || ""}
            placeholder="Enter your name..."
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Bio</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="bio"
            value={form.bio || ""}
            onChange={handleChange}
            placeholder="Enter your bio..."
            style={{ maxHeight: "250px", minHeight: "100px", resize: "vertical" }}
          />
        </Form.Group>

        <Button type="submit" variant="outline-primary" className="w-100 mt-2" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </Form>
    </motion.div>
  );
}
