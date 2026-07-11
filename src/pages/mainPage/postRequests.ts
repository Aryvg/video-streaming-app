import axios from "axios";
import { getAccessToken } from "./auth";
//in uploadpanel we have
/*
const handleUploadSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        try {
            await postUpload({
                title: form.title,
                shortDescription: form.shortDescription,
                longDescription: form.longDescription,
                thumbnailFile: form.thumbnailFile,
                videoFile: form.videoFile,
            });

            handleUpload();
            alert('sent successfully');
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };
*/ 
export interface UploadPayload {
  title: string;
  shortDescription: string;
  longDescription: string;
  thumbnailFile: File | null;
  videoFile: File | null;
}

export async function postUpload(payload: UploadPayload) {
  const token = await getAccessToken();
  if (!token) {
    throw new Error("No access token available");
  }

  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("shortDescription", payload.shortDescription);
  formData.append("fullDescription", payload.longDescription);

  if (payload.thumbnailFile) {
    formData.append("thumbnail", payload.thumbnailFile);
  }

  if (payload.videoFile) {
    formData.append("videoFile", payload.videoFile);
  }

  await axios.post("https://videostreamingbackend-dxgv.onrender.com/uploadintomainpage", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
}
