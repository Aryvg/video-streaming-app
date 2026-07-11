import axios from 'axios';
import { setAccessToken } from '../mainPage/auth';

export const handleSignupClick = (
    profilePic: File | null,
    profilePicPreview: string,
    signupEmail: string,
    signupPassword: string,
    confirmPassword: string,
    firstName: string,
    lastName: string,
    age: string,
    country: string,
    isReady: boolean,
    submitting: boolean,
    setSubmitting: (value: boolean) => void,
    navigate: (path: string) => void,
    uploadProfileImage: (file: File) => Promise<string>,
    onSignupSuccess?: () => void
) => async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!isReady || submitting) return;

    setSubmitting(true);

    try {
        const profilePhotoUrl = profilePic ? await uploadProfileImage(profilePic) : profilePicPreview;

        await axios.post('https://videostreamingbackend-dxgv.onrender.com/register', {
            user: signupEmail.trim(),
            pwd: signupPassword.trim(),
            confirmPassword: confirmPassword.trim(),
            firstname: firstName.trim(),
            lastname: lastName.trim(),
            age: age.trim(),
            profilePhoto: profilePhotoUrl,
            country: country.trim(),
        });

        onSignupSuccess?.();

        // const response = await axios.post('https://videostreamingbackend-dxgv.onrender.com/auth', {
        //     username: signupEmail.trim(),
        //     password: signupPassword.trim(),
        // }, {
        //     withCredentials: true,
        // });

        // if (response.data?.accessToken) {
        //     setAccessToken(response.data.accessToken);
        // }

        // navigate('/mainPage');
    } catch (error: any) {
        const message = error?.response?.data?.message || '';

        if (error?.response?.status === 409 && /pending verification/i.test(message)) {
            onSignupSuccess?.();
            return;
        }

        console.error('Signup failed:', error);
    } finally {
        setSubmitting(false);
    }
};
//in signupForm.tsx, we have
/**
  <button
                         type="submit"
                         className="submit-button"
                         disabled={signupLoading || !isReady || submitting}
                         onClick={handleSignupClick(
                             profilePic,
                             profilePicPreview,
                             signupEmail,
                             signupPassword,
                             confirmPassword,
                             firstName,
                             lastName,
                             age,
                             country,
                             isReady as boolean,
                             submitting,
                             setSubmitting,
                             navigate,
                             uploadProfileImage
                         )}
                     >
                         {signupLoading || submitting ? <Spinner /> : 'Create Account'}
                     </button>
 */
