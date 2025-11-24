import axios from "axios";

export enum cloudinaryFolder {
  Easy_Chat = "Easy_Chat",
  Chat_Images = 'Chat_Images',

}
export function extractPublicId(url: string): string {
  const afterFolder = url.split("Easy_Chat/")[1];

  const idOnly = afterFolder.replace(/\.[a-zA-Z0-9]+$/, "");

  return idOnly; 
}

const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET!;

export async function uploadToCloudinary(
  file: File,
  subfolder: cloudinaryFolder = "" as cloudinaryFolder
): Promise<string> {
  
  const baseFolder = cloudinaryFolder.Easy_Chat

  const folderPath = subfolder
    ? `${baseFolder}/${subfolder}`
    : baseFolder;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folderPath);

  const url = `https://api.cloudinary.com/v1_1/sargisx/image/upload`;

  const res = await axios.post(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.secure_url;
}

export async function deleteFromCloudinary(
  url: string,
  folder: cloudinaryFolder = cloudinaryFolder.Easy_Chat
): Promise<void> {
  const publicId = extractPublicId(url);
  const timestamp = Math.round(new Date().getTime() / 1000);
  const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY!; 
  const apiSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET!; // Ensure this is set in your environment

  // Generate signature
  const signatureParams = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = btoa(signatureParams);

  const deleteUrl = `https://api.cloudinary.com/v1_1/sargisx/image/destroy`;

  await axios.post(deleteUrl, null, {
    params: {
      public_id: `${folder}/${publicId}`,
      timestamp,
      api_key: apiKey,
      signature,
    },
  });
}
