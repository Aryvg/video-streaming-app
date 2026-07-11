import axios from 'axios';
import { checkEmailAvailability } from '../../utils/checkEmailAvailability';

export const handlePostClick = (
    forgotEmail: string,
    setStatus?: (message: string, type: 'success' | 'error') => void,
    onEmailVerified?: (code: string) => void,
) => async () => {
    const trimmedEmail = forgotEmail.trim();

    if (!trimmedEmail) {
        setStatus?.('Email is required.', 'error');
        return;
    }

    try {
        const { available } = await checkEmailAvailability(trimmedEmail);
        const message = available ? 'Email is not registered.' : 'Email is registered.';
        const type = available ? 'error' : 'success';

        setStatus?.(message, type);

        if (!available) {
            const { data } = await axios.post('https://videostreamingbackend-dxgv.onrender.com/forgotPassword', {
                email: trimmedEmail,
            });
            onEmailVerified?.(data.code || '');
        }
    } catch (error) {
        console.error('Forgot password failed:', error);
        setStatus?.('Unable to verify email right now.', 'error');
    }
};
/**
 I have a file called forgotEmailForm within which we have the send Recovery code button and this button run the handlePostClick function when clicked. the logic for handlePostClick function is located in Postrequesttoforgotpass.ts. what I want you to do for me now is this. the api called https://videostreamingbackend-dxgv.onrender.com/forgotPassword to which the send recovery button sends a post requests brings an error that says This email is not registered if fthe email is not registered or if the user enters an email that is already not registered. What I want you to do for me now is when i insert the email and click the send recovery button, I want the frontend which is postrequesttoforgotpass.ts to check if the email that is being entered is already registered like the backend does and if it is already registered, I want a green text to come below the add recovery code input that states that the email is registered but if the email is not registered, I want it to bring a text that says email is not registered. do this carefully without deleting any of the codes that I wrote but adding a very short code that will implement what i said. write a very short and clean code
 */