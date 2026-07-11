import axios from 'axios';

export async function uploadProfileImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await axios.post('https://videostreamingbackend-dxgv.onrender.com/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    return data.url;
}
