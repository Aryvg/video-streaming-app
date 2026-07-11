import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, RefObject } from "react";
import { UploadPanel, type VideoFormState } from "./UploadPanel";
import { UploadsSection, type VideoItem } from "./UploadsSection";
import { EditVideoModal } from "./EditVideoModal";
import { loadUploadsFromServer } from "./getRequest";
import { logoutUser } from "./logout";
import "./mainPage.css";

const EMPTY_FORM: VideoFormState = {
  title: "",
  shortDescription: "",
  longDescription: "",
  thumbnailFile: null,
  videoFile: null,
};

export function MainPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [form, setForm] = useState<VideoFormState>(EMPTY_FORM);
  const [justUploaded, setJustUploaded] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<VideoFormState>(EMPTY_FORM);

  const thumbnailInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const editThumbnailInputRef = useRef<HTMLInputElement | null>(null);
  const editVideoInputRef = useRef<HTMLInputElement | null>(null);

  const editingVideo = videos.find((v) => v.id === editingId) ?? null;

  // Revoke every object URL still alive when the page unmounts.
  useEffect(() => {
    return () => {
      videos.forEach((v) => {
        URL.revokeObjectURL(v.thumbnailUrl);
        URL.revokeObjectURL(v.videoUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetUploadForm = () => {
    setForm(EMPTY_FORM);
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  useEffect(() => {
    const fetchUploads = async () => {
      const uploads = await loadUploadsFromServer();
      setVideos(uploads);
    };

    void fetchUploads();
  }, []);

  const handleUpload = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!form.thumbnailFile || !form.videoFile) return;

    resetUploadForm();
    setJustUploaded(true);
    window.setTimeout(() => setJustUploaded(false), 1600);

    const uploads = await loadUploadsFromServer();
    setVideos(uploads);
  };

  const handleDelete = (id: string) => {
    setVideos((prev) => {
      const target = prev.find((v) => v.id === id);
      if (target) {
        URL.revokeObjectURL(target.thumbnailUrl);
        URL.revokeObjectURL(target.videoUrl);
      }
      return prev.filter((v) => v.id !== id);
    });
    if (editingId === id) closeEdit();
  };

  const openEdit = (video: VideoItem) => {
    setEditingId(video.id);
    setEditForm({
      title: video.title,
      shortDescription: video.shortDescription,
      longDescription: video.longDescription,
      thumbnailFile: null,
      videoFile: null,
    });
  };

  const closeEdit = () => {
    setEditingId(null);
    setEditForm(EMPTY_FORM);
    if (editThumbnailInputRef.current) editThumbnailInputRef.current.value = "";
    if (editVideoInputRef.current) editVideoInputRef.current.value = "";
  };

  const handleUpdate = (e: FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    setVideos((prev) =>
      prev.map((v) => {
        if (v.id !== editingId) return v;

        let thumbnailUrl = v.thumbnailUrl;
        let thumbnailName = v.thumbnailName;
        if (editForm.thumbnailFile) {
          URL.revokeObjectURL(v.thumbnailUrl);
          thumbnailUrl = URL.createObjectURL(editForm.thumbnailFile);
          thumbnailName = editForm.thumbnailFile.name;
        }

        let videoUrl = v.videoUrl;
        let videoName = v.videoName;
        if (editForm.videoFile) {
          URL.revokeObjectURL(v.videoUrl);
          videoUrl = URL.createObjectURL(editForm.videoFile);
          videoName = editForm.videoFile.name;
        }

        return {
          ...v,
          title: editForm.title.trim(),
          shortDescription: editForm.shortDescription.trim(),
          longDescription: editForm.longDescription.trim(),
          thumbnailUrl,
          thumbnailName,
          videoUrl,
          videoName,
        };
      })
    );

    closeEdit();
  };

  return (
    <div className="studio-page">
      <div className="studio-container">
        <header className="studio-header">
          <div className="studio-header__top">
            <div>
              <span className="studio-eyebrow">Creator studio</span>
              <h1 className="studio-title">Upload Studio</h1>
              <p className="studio-subtitle">Add a new video to your channel.</p>
            </div>
            <button type="button" className="studio-logout-btn" onClick={() => void logoutUser()}>
              <span className="studio-logout-btn__icon">⎋</span>
              <span>Logout</span>
            </button>
          </div>
        </header>

        <UploadPanel
          form={form}
          justUploaded={justUploaded}
          handleFormChange={handleFormChange}
          handleUpload={handleUpload}
          thumbnailInputRef={thumbnailInputRef}
          videoInputRef={videoInputRef}
          onThumbnailPick={(e) =>
            setForm((prev) => ({
              ...prev,
              thumbnailFile: e.target.files?.[0] ?? null,
            }))
          }
          onVideoPick={(e) =>
            setForm((prev) => ({
              ...prev,
              videoFile: e.target.files?.[0] ?? null,
            }))
          }
        />

        <UploadsSection videos={videos} onEdit={openEdit} onDelete={handleDelete} />
      </div >

      <EditVideoModal
        editingVideo={editingVideo}
        editForm={editForm}
        editThumbnailInputRef={editThumbnailInputRef}
        editVideoInputRef={editVideoInputRef}
        onClose={closeEdit}
        onEditFormChange={handleEditFormChange}
        onSubmit={handleUpdate}
        onThumbnailPick={(e) =>
          setEditForm((prev) => ({
            ...prev,
            thumbnailFile: e.target.files?.[0] ?? null,
          }))
        }
        onVideoPick={(e) =>
          setEditForm((prev) => ({
            ...prev,
            videoFile: e.target.files?.[0] ?? null,
          }))
        }
        onSuccess={handleUpload}
      />
    </div >
  );
}

interface PickerFieldProps {
  label: string;
  hint: string;
  accept: string;
  file: File | null;
  inputRef: RefObject<HTMLInputElement | null>;
  onPick: (e: ChangeEvent<HTMLInputElement>) => void;
  kind: "image" | "video";
  required?: boolean;
  currentPreviewUrl?: string;
  currentFileName?: string;
}

function PickerField({
  label,
  hint,
  accept,
  file,
  inputRef,
  onPick,
  kind,
  required,
  currentPreviewUrl,
  currentFileName,
}: PickerFieldProps) {
  const [newPreviewUrl, setNewPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setNewPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setNewPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const displayImage =
    kind === "image" ? newPreviewUrl ?? currentPreviewUrl ?? null : null;
  const displayName = file?.name ?? currentFileName ?? null;
  const isFilled = Boolean(displayImage) || (kind === "video" && Boolean(displayName));

  return (
    <label className={`picker picker--${kind}${isFilled ? " picker--filled" : ""}`}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        required={required}
        onChange={onPick}
        className="picker__input"
        aria-label={label}
      />

      {displayImage && (
        <img className="picker__preview-image" src={displayImage} alt="" />
      )}

      <div className="picker__content">
        {!displayImage && (
          <span className="picker__icon">
            {kind === "image" ? <ImageIcon /> : <VideoIcon />}
          </span>
        )}
        <span className="picker__label">{label}</span>
        <span className="picker__hint">{displayName ? displayName : hint}</span>
      </div>
    </label>
  );
}

function ImageIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="M21 16l-5.5-5.5L9 17" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2.5" y="5.5" width="14" height="13" rx="2" />
      <path d="M21.5 8.5l-5 3.5 5 3.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M6 7l1 13h10l1-13" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
