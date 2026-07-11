import axios from "axios";
import { getAccessToken } from "./auth";
import type { VideoItem } from "./UploadsSection";
// in mainpage, we have const [videos, setVideos] = useState<VideoItem[]>([]); we also have
/**
 const handleUpload = async (e?: FormEvent) => {
     e?.preventDefault();
     if (!form.thumbnailFile || !form.videoFile) return;
 
     resetUploadForm();
     setJustUploaded(true);
     window.setTimeout(() => setJustUploaded(false), 1600);
 
     const uploads = await loadUploadsFromServer();
     setVideos(uploads);
   };
 */
export async function loadUploadsFromServer(): Promise<VideoItem[]> {
  try {
    const token = await getAccessToken();
    if (!token) return [];

    const response = await axios.get("https://videostreamingbackend-dxgv.onrender.com/uploadintomainpage", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    const uploads = Array.isArray(response.data) ? response.data : [];

    return uploads.map((upload: any) => ({
      id: upload.itemId || upload._id || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      title: upload.title || "",
      shortDescription: upload.shortDescription || "",
      longDescription: upload.fullDescription || "",
      thumbnailUrl: upload.thumbnail || "",
      thumbnailName: upload.thumbnail ? upload.thumbnail.split("/").pop() || "" : "",
      videoUrl: upload.videoFile || "",
      videoName: upload.videoFile ? upload.videoFile.split("/").pop() || "" : "",
    }));
  } catch (error) {
    console.error("Failed to load uploads:", error);
    return [];
  }
}
