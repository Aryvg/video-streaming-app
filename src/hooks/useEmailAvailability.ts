import { useEffect, useState } from 'react';
import { checkEmailAvailability } from '../utils/checkEmailAvailability';

export function useEmailAvailability(signupEmail: string) {
    const [emailStatus, setEmailStatus] = useState({ available: false, message: '', checking: false });

    useEffect(() => {
        const trimmedEmail = signupEmail.trim();

        if (!trimmedEmail) {
            setEmailStatus({ available: false, message: '', checking: false });
            return;
        }

        if (!/^[\w-.]+@gmail\.com$/.test(trimmedEmail)) {
            setEmailStatus({ available: false, message: 'Please enter a valid @gmail.com email.', checking: false });
            return;
        }

        const timer = window.setTimeout(async () => {
            setEmailStatus((prev) => ({ ...prev, checking: true, message: '' }));
            const result = await checkEmailAvailability(trimmedEmail);
            setEmailStatus({ available: result.available, message: result.message, checking: false });
        }, 400);

        return () => window.clearTimeout(timer);
    }, [signupEmail]);

    return emailStatus;
}
