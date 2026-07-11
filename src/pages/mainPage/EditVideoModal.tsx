import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent, RefObject, MouseEvent } from "react";
import { putUpload } from './putRequest';

interface VideoItem {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  thumbnailUrl: string;
  thumbnailName: string;
  videoUrl: string;
  videoName: string;
}

interface VideoFormState {
  title: string;
  shortDescription: string;
  longDescription: string;
  thumbnailFile: File | null;
  videoFile: File | null;
}

interface EditVideoModalProps {
  editingVideo: VideoItem | null;
  editForm: VideoFormState;
  editThumbnailInputRef: RefObject<HTMLInputElement | null>;
  editVideoInputRef: RefObject<HTMLInputElement | null>;
  onClose: () => void;
  onEditFormChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: FormEvent) => void;
  onThumbnailPick: (e: ChangeEvent<HTMLInputElement>) => void;
  onVideoPick: (e: ChangeEvent<HTMLInputElement>) => void;
  onSuccess?: () => void;
}

export function EditVideoModal({
  editingVideo,
  editForm,
  editThumbnailInputRef,
  editVideoInputRef,
  onClose,
  onEditFormChange,
  onSubmit,
  onThumbnailPick,
  onVideoPick,
  onSuccess,
}: EditVideoModalProps) {
  const [loading, setLoading] = useState(false);
  if (!editingVideo) return null;

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

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="Edit video"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__header">
          <h2 className="modal__title">Edit video</h2>
          <button
            type="button"
            className="modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <form className="upload-form" onSubmit={onSubmit}>
          <div className="upload-form__fields">
            <label className="field">
              <span className="field__label">Title</span>
              <input
                className="field__input"
                type="text"
                name="title"
                value={editForm.title}
                onChange={onEditFormChange}
                maxLength={100}
                required
              />
            </label>

            <label className="field">
              <span className="field__label">Short description</span>
              <textarea
                className="field__input field__input--short"
                name="shortDescription"
                value={editForm.shortDescription}
                onChange={onEditFormChange}
                maxLength={160}
                required
              />
            </label>

            <label className="field">
              <span className="field__label">Full description</span>
              <textarea
                className="field__input field__input--long"
                name="longDescription"
                value={editForm.longDescription}
                onChange={onEditFormChange}
                required
              />
            </label>
          </div>

          <div className="upload-form__media">
            <PickerField
              label="Thumbnail"
              hint="PNG or JPG"
              accept="image/*"
              file={editForm.thumbnailFile}
              inputRef={editThumbnailInputRef}
              onPick={onThumbnailPick}
              kind="image"
              currentPreviewUrl={editingVideo.thumbnailUrl}
              currentFileName={editingVideo.thumbnailName}
            />

            <PickerField
              label="Video file"
              hint="MP4, WebM, or MOV"
              accept="video/*"
              file={editForm.videoFile}
              inputRef={editVideoInputRef}
              onPick={onVideoPick}
              kind="video"
              currentFileName={editingVideo.videoName}
            />
          </div>

          <div className="modal__actions">
            <button type="button" className="btn btn--ghost" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="button" className="btn btn--primary" onClick={handleUpdateSubmit} disabled={loading}>
              {loading ? '⏳ Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
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

  const displayImage = kind === "image" ? newPreviewUrl ?? currentPreviewUrl ?? null : null;
  const displayName = file?.name ?? currentFileName ?? null;
  const isFilled = Boolean(displayImage) || (kind === "video" && Boolean(displayName));

  return (
    <label className={`picker picker--${kind}${isFilled ? " picker--filled" : ""}`}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
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
