import axios from 'axios';

export const isResetCodeMatching = (enteredCode: string, sentCode: string) =>
    enteredCode.trim().length === 6 && enteredCode.trim() === sentCode.trim();

export const handlePostClickForReset = (
    forgotEmail: string,
    resetCode: string,
    newPassword: string,
    confirmNewPassword: string
) => async () => {
    // event.preventDefault();
    // event: React.MouseEvent<HTMLButtonElement>
    try {
        await axios.post('https://videostreamingbackend-dxgv.onrender.com/resetPassword', {
            "email": forgotEmail.trim(),
            "code": resetCode.trim(),
            "newPassword": newPassword.trim(),
            "confirmPassword": confirmNewPassword.trim()
        });

    } catch (error) {
        console.error('Reset password failed:', error);
    }
};
//in forgotEmailForm.tsx, we have
/**
  <button
                         type="submit"
                         className="submit-button"
                         disabled={forgotLoading || !isReady || submitting}
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
/*
That is so good. The next thing I want you to do for me is this. in resetpasswordform.tsx, I have a reset password button. and this reset password button sends a post request to https://videostreamingbackend-dxgv.onrender.com/resetPassword. something I want to tell you here is that https://videostreamingbackend-dxgv.onrender.com/resetPassword checks if the code that the user sends is similar to the email that is generated or sent to the email of the person that is trying to update his passowrd. I want you to write a code in postRequesttorsetpass.ts that checks if the code the user enters is similar to the code that was sent. if the codes are not similar, i want a red text that states that the codes are not similar to appear below the code input and I want this to be a live check and if the codes are not similar, i want the the reset password button to be disabled. but if the codes are the same, let a text that states that the codes are similar appear below the code input in green and let the reset password button not be diabled. do by writing a very short code and without deleting any of the codes that I wrote. do it carefully.
*/