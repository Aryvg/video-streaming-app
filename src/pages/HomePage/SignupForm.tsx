import axios from 'axios';
import { useState } from 'react';
import { useEmailAvailability } from '../../hooks/useEmailAvailability';
import { isSignupFormReady } from '../../utils/isSignupFormReady';
import { uploadProfileImage } from '../../utils/uploadProfileImage';
import { useNavigate } from 'react-router';
import { handleSignupClick } from './signup';
import { setAccessToken } from '../mainPage/auth.ts';

type SignupFormProps = {
    profilePic: File | null;
    profilePicPreview: string;
    firstName: string;
    lastName: string;
    age: string;
    country: string;
    signupEmail: string;
    signupPassword: string;
    confirmPassword: string;
    showSignupPassword: boolean;
    signupErrors: Record<string, string>;
    signupLoading: boolean;
    signupSuccess: boolean;
    countries: string[];
    onProfilePicClick: () => void;
    onProfilePicChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFirstNameChange: (value: string) => void;
    onLastNameChange: (value: string) => void;
    onAgeChange: (value: string) => void;
    onCountryChange: (value: string) => void;
    onEmailChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onConfirmPasswordChange: (value: string) => void;
    onTogglePassword: () => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
};

function Spinner() {
    return <span className="spinner" aria-hidden="true" />;
}

function CameraIcon() {
    return (
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path
                d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2.2l.9-1.5A1.5 1.5 0 0 1 9.9 4.7h4.2c.5 0 1 .3 1.3.8L16.3 7h2.2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-9z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
            <circle cx="12" cy="12.5" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    );
}

function EyeIcon({ open }: { open: boolean }) {
    if (open) {
        return (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path
                    d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                />
                <circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
        );
    }
    return (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
                d="M3 3l18 18M10.6 10.7a3.2 3.2 0 0 0 4.5 4.5M6.6 6.8C4 8.3 2 12 2 12s3.6 7 10 7c1.8 0 3.4-.4 4.7-1.1M17.9 17.2C20.2 15.6 22 12 22 12s-2-3.9-5.4-5.9A11.6 11.6 0 0 0 12 5c-.8 0-1.6.1-2.3.2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
export function SignupForm({
    profilePic,
    profilePicPreview,
    firstName,
    lastName,
    age,
    country,
    signupEmail,
    signupPassword,
    confirmPassword,
    showSignupPassword,
    signupErrors,
    signupLoading,
    signupSuccess,
    countries,
    onProfilePicClick,
    onProfilePicChange,
    onFirstNameChange,
    onLastNameChange,
    onAgeChange,
    onCountryChange,
    onEmailChange,
    onPasswordChange,
    onConfirmPasswordChange,
    onTogglePassword,
    onSubmit,
    fileInputRef,
}: SignupFormProps) {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [verifyCode, setVerifyCode] = useState('');
    const [verifyMessage, setVerifyMessage] = useState('');
    const emailStatus = useEmailAvailability(signupEmail);
    const isReady = isSignupFormReady({
        firstName,
        lastName,
        age,
        country,
        signupEmail,
        signupPassword,
        confirmPassword,
        profilePicPreview,
        emailAvailable: emailStatus.available,
        isCheckingEmail: emailStatus.checking,
    });

    return (

        <>
            <div className="panel-head">
                <span className="panel-eyebrow">NEW ARRIVAL</span>
                <h1 className="panel-title">Create your account</h1>
            </div>

            {signupSuccess ? (
                <div className="success-block">
                    <div className="stamp-badge" role="img" aria-label="VERIFIED">
                        <span className="stamp-badge__ring stamp-badge__ring--outer" />
                        <span className="stamp-badge__ring stamp-badge__ring--inner" />
                        <span className="stamp-badge__label">VERIFIED</span>
                    </div>
                    <h2 className="success-title">Welcome aboard!</h2>
                    <p className="success-copy">Your account has been created. Taking you to log in&hellip;</p>
                </div>
            ) : (
                <form noValidate onSubmit={onSubmit} className="auth-form">
                    <div className="field avatar-field">
                        <label>Profile photo</label>
                        <div className="avatar-uploader">
                            <button
                                type="button"
                                className="avatar-button"
                                onClick={onProfilePicClick}
                                aria-label="Choose profile photo"
                            >
                                {profilePicPreview ? (
                                    <img src={profilePicPreview} alt="" className="avatar-preview" />
                                ) : (
                                    <CameraIcon />
                                )}
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={onProfilePicChange}
                            />
                            <div className="avatar-hint">
                                <span>{profilePic ? profilePic.name : 'PNG or JPG, up to 5MB'}</span>
                                {signupErrors.profilePic && (
                                    <span className="field-error">{signupErrors.profilePic}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="field-row">
                        <div className="field">
                            <label htmlFor="signup-first-name">First name</label>
                            <input
                                id="signup-first-name"
                                type="text"
                                autoComplete="given-name"
                                placeholder="Abel"
                                value={firstName}
                                onChange={(e) => onFirstNameChange(e.target.value)}
                                className={signupErrors.firstName ? 'has-error' : ''}
                            />
                            {signupErrors.firstName && <span className="field-error">{signupErrors.firstName}</span>}
                        </div>
                        <div className="field">
                            <label htmlFor="signup-last-name">Last name</label>
                            <input
                                id="signup-last-name"
                                type="text"
                                autoComplete="family-name"
                                placeholder="Tesfaye"
                                value={lastName}
                                onChange={(e) => onLastNameChange(e.target.value)}
                                className={signupErrors.lastName ? 'has-error' : ''}
                            />
                            {signupErrors.lastName && <span className="field-error">{signupErrors.lastName}</span>}
                        </div>
                    </div>

                    <div className="field-row">
                        <div className="field">
                            <label htmlFor="signup-age">Age</label>
                            <input
                                id="signup-age"
                                type="number"
                                inputMode="numeric"
                                min={13}
                                max={120}
                                placeholder="25"
                                value={age}
                                onChange={(e) => onAgeChange(e.target.value)}
                                className={signupErrors.age ? 'has-error' : ''}
                            />
                            {signupErrors.age && <span className="field-error">{signupErrors.age}</span>}
                        </div>
                        <div className="field">
                            <label htmlFor="signup-country">Country</label>
                            <select
                                id="signup-country"
                                value={country}
                                onChange={(e) => onCountryChange(e.target.value)}
                                className={signupErrors.country ? 'has-error' : ''}
                            >
                                <option value="">Select your country</option>
                                {countries.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                            {signupErrors.country && <span className="field-error">{signupErrors.country}</span>}
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="signup-email">Email address (this is your username)</label>
                        <input
                            id="signup-email"
                            type="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            value={signupEmail}
                            onChange={(e) => onEmailChange(e.target.value)}
                            className={signupErrors.signupEmail ? 'has-error' : ''}
                        />
                        {signupErrors.signupEmail && <span className="field-error">{signupErrors.signupEmail}</span>}
                        {/* live check starts here */}
                        {!signupErrors.signupEmail && signupEmail && (
                            <span
                                style={{
                                    display: 'block',
                                    marginTop: '0.45rem',
                                    fontSize: '0.9rem',
                                    color: emailStatus.checking ? '#6b7280' : emailStatus.available ? '#16a34a' : '#dc2626',
                                }}
                            >
                                {emailStatus.checking ? 'Checking email...' : emailStatus.message}
                            </span>
                        )}
                        {/* live check ends here */}
                    </div>

                    <div className="field-row">
                        <div className="field">
                            <label htmlFor="signup-password">Password</label>
                            <div className="password-wrap">
                                <input
                                    id="signup-password"
                                    type={showSignupPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    value={signupPassword}
                                    onChange={(e) => onPasswordChange(e.target.value)}
                                    className={signupErrors.signupPassword ? 'has-error' : ''}
                                />
                                <button
                                    type="button"
                                    className="toggle-visibility"
                                    onClick={onTogglePassword}
                                    aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
                                >
                                    <EyeIcon open={showSignupPassword} />
                                </button>
                            </div>
                            {signupErrors.signupPassword && (
                                <span className="field-error">{signupErrors.signupPassword}</span>
                            )}
                        </div>
                        <div className="field">
                            <label htmlFor="signup-confirm-password">Confirm password</label>
                            <input
                                id="signup-confirm-password"
                                type={showSignupPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => onConfirmPasswordChange(e.target.value)}
                                className={signupErrors.confirmPassword ? 'has-error' : ''}
                            />
                            {signupErrors.confirmPassword && (
                                <span className="field-error">{signupErrors.confirmPassword}</span>
                            )}
                        </div>
                    </div>

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
                            uploadProfileImage,
                            () => setShowVerifyModal(true)
                        )}
                    >
                        {signupLoading || submitting ? <Spinner /> : 'Create Account'}
                    </button>
                </form>
            )}
            {showVerifyModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
                    <div style={{ background: '#fff', padding: 20, borderRadius: 10, width: 300 }}>
                        <input
                            value={verifyCode}
                            onChange={(e) => setVerifyCode(e.target.value)}
                            placeholder="Enter verification code"
                            style={{ width: '100%', marginBottom: 10, padding: 8 }}
                        />
                        <button
                            type="button"
                            className="submit-button"
                            onClick={async () => {
                                try {
                                    await axios.post('https://videostreamingbackend-dxgv.onrender.com/verifyEmail', { email: signupEmail.trim(), code: verifyCode.trim() });
                                    setVerifyMessage('Verified successfully');
                                    setShowVerifyModal(false);

                                    const response = await axios.post('https://videostreamingbackend-dxgv.onrender.com/auth', {
                                        username: signupEmail.trim(),
                                        password: signupPassword.trim(),
                                    }, {
                                        withCredentials: true,
                                    });

                                    if (response.data?.accessToken) {
                                        setAccessToken(response.data.accessToken);
                                    }

                                    navigate('/mainPage');
                                } catch {
                                    setVerifyMessage('Invalid verification code');
                                }
                            }}
                        >
                            Verify your account
                        </button>
                        {verifyMessage && <div style={{ marginTop: 8, color: verifyMessage.includes('Invalid') ? 'red' : 'green' }}>{verifyMessage}</div>}
                    </div>
                </div>
            )}
        </>
    );
}
