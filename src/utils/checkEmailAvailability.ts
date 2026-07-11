import axios from 'axios';

export async function checkEmailAvailability(email: string) {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
        return { available: false, message: '' };
    }

    try {
        const { data } = await axios.get('https://videostreamingbackend-dxgv.onrender.com/register/check-availability', {
            params: { user: trimmedEmail },
        });

        return {
            available: data.available,
            message: data.message || (data.available ? 'Email is available.' : 'Email is already taken.'),
        };
    } catch {
        return { available: false, message: 'Unable to verify email right now.' };
    }
}
