import axios from "axios";
import { getAccessToken } from "./auth";
// in editVideoModal.tsx, we have
/**
  const handleUpdateSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
           event.preventDefault();
           setLoading(true);
           try {
               await putUpload({
                   itemId: editingVideo.id,
                   title: editForm.title,
                   shortDescription: editForm.shortDescription,
                   longDescription: editForm.longDescription,
                   thumbnailFile: editForm.thumbnailFile,
                   videoFile: editForm.videoFile,
               });
               onClose();
               onSuccess?.();
           } catch (error) {
               console.error('Upload failed:', error);
           } finally {
               setLoading(false);
           }
       };
 */
export interface UploadPayload {
  itemId: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  thumbnailFile: File | null;
  videoFile: File | null;
}

export async function putUpload(payload: UploadPayload) {
  const token = await getAccessToken();
  if (!token) {
    throw new Error("No access token available");
  }

  const formData = new FormData();
  formData.append("itemId", payload.itemId);
  formData.append("title", payload.title);
  formData.append("shortDescription", payload.shortDescription);
  formData.append("fullDescription", payload.longDescription);

  if (payload.thumbnailFile) {
    formData.append("thumbnail", payload.thumbnailFile);
  }

  if (payload.videoFile) {
    formData.append("videoFile", payload.videoFile);
  }

  await axios.put("https://videostreamingbackend-dxgv.onrender.com/uploadintomainpage", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
}
