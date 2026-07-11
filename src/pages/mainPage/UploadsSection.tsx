
import { handleDelete } from "./deleteRequest";
export interface VideoItem {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  thumbnailUrl: string;
  thumbnailName: string;
  videoUrl: string;
  videoName: string;
}

interface UploadsSectionProps {
  videos: VideoItem[];
  onEdit: (video: VideoItem) => void;
  onDelete: (id: string) => void;
}


export function UploadsSection({ videos, onEdit, onDelete }: UploadsSectionProps) {
  const displayVideos = videos.map((video) => ({
    itemId: video.id,
    title: video.title,
    shortDescription: video.shortDescription,
    thumbnail: video.thumbnailUrl,
    fullDescription: video.longDescription,
    videoFile: video.videoUrl,
  }));

  return (
    <section className="uploads-section" aria-label="Your uploads">
      <div className="uploads-section__header">
        <h2 className="uploads-section__title">Your uploads</h2>
        <span className="uploads-section__count">
          {displayVideos.length} {displayVideos.length === 1 ? "video" : "videos"}
        </span>
      </div>

      {displayVideos.length === 0 ? (
        <div className="empty-state">
          <p>Nothing here yet. Upload your first video above to get started.</p>
        </div>
      ) : (
        <div className="video-shelf">
          {displayVideos.map((video: {
            itemId: string;
            title: string;
            shortDescription: string;
            thumbnail: string;
            fullDescription: string;
            videoUrl?: string;
            videoFile: string;
          }, index: number) => (
            <article className="video-card" key={video.itemId}>
              <div className="video-card__thumb-wrap">
                <img
                  className="video-card__thumb"
                  src={video.thumbnail}
                  alt={`Thumbnail for ${video.title}`}
                />
              </div>

              <div className="video-card__body">
                <h3 className="video-card__title">{video.title}</h3>
                <p className="video-card__short">{video.shortDescription}</p>
                <p className="video-card__long">{video.fullDescription}</p>

                <video
                  className="video-card__video"
                  src={video.videoFile}
                  controls
                  preload="metadata"
                />

                <div className="video-card__actions">
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => onEdit(videos[index])}
                  >
                    <EditIcon />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn--danger"
                    onClick={handleDelete(video.itemId, onDelete)}
                  >
                    <DeleteIcon />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
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
