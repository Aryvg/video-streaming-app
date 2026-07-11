export function isSignupFormReady({
    firstName,
    lastName,
    age,
    country,
    signupEmail,
    signupPassword,
    confirmPassword,
    profilePicPreview,
    emailAvailable,
    isCheckingEmail,
}: {
    firstName: string;
    lastName: string;
    age: string;
    country: string;
    signupEmail: string;
    signupPassword: string;
    confirmPassword: string;
    profilePicPreview: string;
    emailAvailable: boolean;
    isCheckingEmail: boolean;
}) {
    const hasRequiredFields =
        firstName.trim() &&
        lastName.trim() &&
        age.trim() &&
        country.trim() &&
        signupEmail.trim() &&
        signupPassword.trim() &&
        confirmPassword.trim() &&
        profilePicPreview.trim();

    return hasRequiredFields && emailAvailable && !isCheckingEmail && signupPassword === confirmPassword;
}
