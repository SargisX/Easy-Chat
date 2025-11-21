import axios from "axios";

export async function uploadToCloudinary(file: File): Promise<string> {
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET!;
  const folderName = "Easy_Chat"; // ✅ specify your folder

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folderName); // ✅ add folder

  const url = `https://api.cloudinary.com/v1_1/sargisx/image/upload`;

  const res = await axios.post(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.secure_url;
}
