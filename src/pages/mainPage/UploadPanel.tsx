import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent, MouseEvent, RefObject } from "react";
import { postUpload } from './postRequests';

export interface VideoFormState {
    title: string;
    shortDescription: string;
    longDescription: string;
    thumbnailFile: File | null;
    videoFile: File | null;
}

interface UploadPanelProps {
    form: VideoFormState;
    justUploaded: boolean;
    handleFormChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleUpload: (e?: FormEvent) => void;
    thumbnailInputRef: RefObject<HTMLInputElement | null>;
    videoInputRef: RefObject<HTMLInputElement | null>;
    onThumbnailPick: (e: ChangeEvent<HTMLInputElement>) => void;
    onVideoPick: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function UploadPanel({
    form,
    justUploaded,
    handleFormChange,
    handleUpload,
    thumbnailInputRef,
    videoInputRef,
    onThumbnailPick,
    onVideoPick,
}: UploadPanelProps) {
    const [isUploading, setIsUploading] = useState(false);

    const handleUploadSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        setIsUploading(true);

        try {
            await postUpload({
                title: form.title,
                shortDescription: form.shortDescription,
                longDescription: form.longDescription,
                thumbnailFile: form.thumbnailFile,
                videoFile: form.videoFile,
            });

            handleUpload();
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <section
            className={`upload-panel${justUploaded ? " upload-panel--flash" : ""}`}
            aria-label="Upload a new video"
        >
            <span className="upload-panel__tally" aria-hidden="true" />

            <form className="upload-form" onSubmit={handleUpload}>
                <div className="upload-form__fields">
                    <label className="field">
                        <span className="field__label">Title</span>
                        <input
                            className="field__input"
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleFormChange}
                            placeholder="Give your video a title"
                            maxLength={100}
                            required
                        />
                    </label>

                    <label className="field">
                        <span className="field__label">Short description</span>
                        <textarea
                            className="field__input field__input--short"
                            name="shortDescription"
                            value={form.shortDescription}
                            onChange={handleFormChange}
                            placeholder="A one-line summary viewers see first"
                            maxLength={160}
                            required
                        />
                    </label>

                    <label className="field">
                        <span className="field__label">Full description</span>
                        <textarea
                            className="field__input field__input--long"
                            name="longDescription"
                            value={form.longDescription}
                            onChange={handleFormChange}
                            placeholder="Tell viewers more about this video"
                            required
                        />
                    </label>
                </div>

                <div className="upload-form__media">
                    <PickerField
                        label="Thumbnail"
                        hint="PNG or JPG"
                        accept="image/*"
                        file={form.thumbnailFile}
                        inputRef={thumbnailInputRef}
                        onPick={onThumbnailPick}
                        kind="image"
                        required
                    />

                    <PickerField
                        label="Video file"
                        hint="MP4, WebM, or MOV"
                        accept="video/*"
                        file={form.videoFile}
                        inputRef={videoInputRef}
                        onPick={onVideoPick}
                        kind="video"
                        required
                    />
                </div>

                <div className="upload-form__footer">
                    <p className="upload-form__note">All fields are required.</p>
                    <div className="upload-form__actions">
                        <span
                            className={`upload-form__status${justUploaded ? " upload-form__status--visible" : ""}`}
                            role="status"
                        >
                            Uploaded
                        </span>
                        <button
                            type="button"
                            className="btn btn--primary"
                            onClick={handleUploadSubmit}
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <span className="upload-form__spinner" aria-label="Uploading" />
                            ) : (
                                "Upload video"
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </section>
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
}: PickerFieldProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!file) {
            setPreviewUrl(null);
            return;
        }

        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [file]);

    const displayImage = kind === "image" ? previewUrl : null;
    const displayName = file?.name ?? null;
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
