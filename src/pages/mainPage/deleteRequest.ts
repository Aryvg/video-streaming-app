import axios from 'axios';
import { getAccessToken } from './auth';

export const handleDelete = (itemId: string, onDelete: (itemId: string) => void) => async () => {
    try {
        const accessToken = await getAccessToken();
        if (!accessToken) {
            console.error('No access token available');
            return;
        }
        await axios.delete('https://videostreamingbackend-dxgv.onrender.com/uploadintomainpage', {
            data: { itemId },// itemId here contains the value of video.itemId
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
        });
        onDelete(itemId);// itemId here contains the value of video.itemId
    } catch (error) {
        console.error('Delete failed:', error);
    }
};
//in uploadSection.tsx, I have
/*
<button
                    type="button"
                    className="btn btn--danger"
                    onClick={handleDelete(video.itemId, onDelete)}
                  >
                    <DeleteIcon />
                    <span>Delete</span>
*/