import imageCompression from "browser-image-compression";

/**
 * Compresses and resizes an image before upload.
 * @param file Original image file
 * @returns A smaller File ready for upload
 */
export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 0.5, // target ≤ 0.5 MB
    maxWidthOrHeight: 800,
    useWebWorker: true,
    initialQuality: 0.7,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error("Error compressing image:", error);
    return file; // fallback
  }
}
