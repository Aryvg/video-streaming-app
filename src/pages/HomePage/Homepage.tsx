import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import './HomePage.css';
import { AuthDecor } from './AuthDecor';
import { AuthTabs } from './AuthTabs';
import { ForgotEmailForm } from './ForgotEmailForm';
import { LoginForm } from './LoginForm';
import { RecoveredState } from './RecoveredState';
import { ResetPasswordForm } from './ResetPasswordForm';
import { SignupForm } from './SignupForm';
import { checkAuthOnLoad } from './checkAuthOnLoad';

type Mode = 'login' | 'signup' | 'forgot-email' | 'forgot-reset' | 'recovered';

const COUNTRIES: string[] = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina',
  'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados',
  'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana',
  'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon',
  'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros',
  'Congo (Congo-Brazzaville)', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czechia (Czech Republic)',
  'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
  'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia',
  'Eswatini (fmr. Swaziland)', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia',
  'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti',
  'Holy See', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
  'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait',
  'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein',
  'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta',
  'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco',
  'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar (formerly Burma)', 'Namibia', 'Nauru',
  'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea',
  'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine State', 'Panama',
  'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania',
  'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines',
  'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles',
  'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa',
  'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland',
  'Syria', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga',
  'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine',
  'United Arab Emirates', 'United Kingdom', 'United States of America', 'Uruguay', 'Uzbekistan',
  'Vanuatu', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe',
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

function Spinner() {
  return <span className="spinner" aria-hidden="true" />;
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

function StampBadge({ label }: { label: string }) {
  return (
    <div className="stamp-badge" role="img" aria-label={label}>
      <span className="stamp-badge__ring stamp-badge__ring--outer" />
      <span className="stamp-badge__ring stamp-badge__ring--inner" />
      <span className="stamp-badge__label">{label}</span>
    </div>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('login');

  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string>('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [country, setCountry] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginSuccessMsg, setLoginSuccessMsg] = useState('');

  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotErrors, setForgotErrors] = useState<Record<string, string>>({});
  const [forgotLoading, setForgotLoading] = useState(false);
  const [sentResetCode, setSentResetCode] = useState('');

  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetErrors, setResetErrors] = useState<Record<string, string>>({});
  const [resetLoading, setResetLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const verifySession = async () => {
      const isAuthenticated = await checkAuthOnLoad();

      if (isAuthenticated) {
        navigate('/mainPage');
      }
    };

    void verifySession();

    // return () => {
    //   if (profilePicPreview) URL.revokeObjectURL(profilePicPreview);
    // };
  }, []);

  function switchMode(next: Mode) {
    setSignupErrors({});
    setLoginErrors({});
    setForgotErrors({});
    setResetErrors({});
    if (next !== 'forgot-reset') {
      setSentResetCode('');
    }
    setMode(next);
  }

  function handleProfilePicChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setSignupErrors((prev) => ({ ...prev, profilePic: 'Please choose an image file' }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setSignupErrors((prev) => ({ ...prev, profilePic: 'Image must be smaller than 5MB' }));
      return;
    }

    setSignupErrors((prev) => {
      const next = { ...prev };
      delete next.profilePic;
      return next;
    });
    if (profilePicPreview) URL.revokeObjectURL(profilePicPreview);
    setProfilePic(file);
    setProfilePicPreview(URL.createObjectURL(file));
  }

  function validateSignup(): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!firstName.trim()) errors.firstName = 'First name is required';
    if (!lastName.trim()) errors.lastName = 'Last name is required';

    const trimmedAge = age.trim();
    if (!trimmedAge) {
      errors.age = 'Age is required';
    } else if (!/^\d+$/.test(trimmedAge) || Number(trimmedAge) < 13 || Number(trimmedAge) > 120) {
      errors.age = 'Enter a real age between 13 and 120';
    }

    if (!country) errors.country = 'Please select your country';

    if (!signupEmail.trim()) {
      errors.signupEmail = 'Email is required';
    } else if (!isValidEmail(signupEmail)) {
      errors.signupEmail = 'Enter a valid email address';
    }

    if (!signupPassword) {
      errors.signupPassword = 'Password is required';
    } else if (signupPassword.length < 8) {
      errors.signupPassword = 'Use at least 8 characters';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (confirmPassword !== signupPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  }

  function handleSignupSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errors = validateSignup();
    setSignupErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSignupLoading(true);
    window.setTimeout(() => {
      setSignupLoading(false);
      setSignupSuccess(true);
      window.setTimeout(() => {
        setSignupSuccess(false);
        setLoginEmail(signupEmail);
        setFirstName('');
        setLastName('');
        setAge('');
        setCountry('');
        setSignupEmail('');
        setSignupPassword('');
        setConfirmPassword('');
        setProfilePic(null);
        setProfilePicPreview('');
        switchMode('login');
      }, 2200);
    }, 1100);
  }

  function validateLogin(): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!loginEmail.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(loginEmail)) {
      errors.email = 'Enter a valid email address';
    }
    if (!loginPassword) errors.password = 'Password is required';
    return errors;
  }

  function handleLoginSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errors = validateLogin();
    setLoginErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoginLoading(true);
    window.setTimeout(() => {
      setLoginLoading(false);
      setLoginSuccessMsg('Logged in successfully!');
      window.setTimeout(() => setLoginSuccessMsg(''), 2600);
    }, 1000);
  }

  function validateForgotEmail(): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!forgotEmail.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(forgotEmail)) {
      errors.email = 'Enter a valid email address';
    }
    return errors;
  }

  function handleForgotEmailSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errors = validateForgotEmail();
    setForgotErrors(errors);
    if (Object.keys(errors).length > 0) return;
  }

  function handleForgotEmailVerified(code: string) {
    setSentResetCode(code);
    setForgotLoading(true);
    window.setTimeout(() => {
      setForgotLoading(false);
      switchMode('forgot-reset');
    }, 1000);
  }

  function validateReset(): Record<string, string> {
    const errors: Record<string, string> = {};
    const trimmedCode = resetCode.trim();
    if (!trimmedCode) {
      errors.code = 'Enter the code we sent you';
    } else if (!/^\d{6}$/.test(trimmedCode)) {
      errors.code = 'The code should be 6 digits';
    } else if (sentResetCode && trimmedCode !== sentResetCode.trim()) {
      errors.code = 'Codes are not similar.';
    }

    if (!newPassword) {
      errors.newPassword = 'Password is required';
    } else if (newPassword.length < 8) {
      errors.newPassword = 'Use at least 8 characters';
    }

    if (!confirmNewPassword) {
      errors.confirmNewPassword = 'Please confirm your password';
    } else if (confirmNewPassword !== newPassword) {
      errors.confirmNewPassword = 'Passwords do not match';
    }

    return errors;
  }

  function handleResetSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errors = validateReset();
    setResetErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setResetLoading(true);
    window.setTimeout(() => {
      setResetLoading(false);
      setResetCode('');
      setNewPassword('');
      setConfirmNewPassword('');
      setMode('recovered');
    }, 1000);
  }

  function resetForgotFlowAndGoToLogin() {
    setForgotEmail('');
    setForgotErrors({});
    setResetErrors({});
    setSentResetCode('');
    switchMode('login');
  }

  return (
    <div className="auth-page">
      <div className="auth-page__bg" aria-hidden="true">
        <span className="bg-shape bg-shape--one" />
        <span className="bg-shape bg-shape--two" />
        <span className="bg-shape bg-shape--three" />
        <span className="bg-grid" />
      </div>

      <div className="auth-card">
        <AuthDecor />

        <section className="auth-card__form-panel">
          <AuthTabs mode={mode} onModeChange={switchMode} />

          <div className="auth-panel-body" key={mode}>
            {mode === 'login' && (
              <LoginForm
                loginEmail={loginEmail}
                loginPassword={loginPassword}
                showLoginPassword={showLoginPassword}
                loginErrors={loginErrors}
                loginLoading={loginLoading}
                loginSuccessMsg={loginSuccessMsg}
                onEmailChange={setLoginEmail}
                onPasswordChange={setLoginPassword}
                onTogglePassword={() => setShowLoginPassword((v) => !v)}
                onSubmit={handleLoginSubmit}
                onForgotPassword={() => switchMode('forgot-email')}
              />
            )}

            {mode === 'signup' && (
              <SignupForm
                profilePic={profilePic}
                profilePicPreview={profilePicPreview}
                firstName={firstName}
                lastName={lastName}
                age={age}
                country={country}
                signupEmail={signupEmail}
                signupPassword={signupPassword}
                confirmPassword={confirmPassword}
                showSignupPassword={showSignupPassword}
                signupErrors={signupErrors}
                signupLoading={signupLoading}
                signupSuccess={signupSuccess}
                countries={COUNTRIES}
                onProfilePicClick={() => fileInputRef.current?.click()}
                onProfilePicChange={handleProfilePicChange}
                onFirstNameChange={setFirstName}
                onLastNameChange={setLastName}
                onAgeChange={setAge}
                onCountryChange={setCountry}
                onEmailChange={setSignupEmail}
                onPasswordChange={setSignupPassword}
                onConfirmPasswordChange={setConfirmPassword}
                onTogglePassword={() => setShowSignupPassword((v) => !v)}
                onSubmit={handleSignupSubmit}
                fileInputRef={fileInputRef}
              />
            )}

            {mode === 'forgot-email' && (
              <ForgotEmailForm
                forgotEmail={forgotEmail}
                forgotErrors={forgotErrors}
                forgotLoading={forgotLoading}
                onEmailChange={setForgotEmail}
                onSubmit={handleForgotEmailSubmit}
                onBackToLogin={() => switchMode('login')}
                onEmailVerified={handleForgotEmailVerified}
              />
            )}

            {mode === 'forgot-reset' && (
              <ResetPasswordForm
                forgotEmail={forgotEmail}
                resetCode={resetCode}
                newPassword={newPassword}
                confirmNewPassword={confirmNewPassword}
                showResetPassword={showResetPassword}
                resetErrors={resetErrors}
                resetLoading={resetLoading}
                onCodeChange={setResetCode}
                onNewPasswordChange={setNewPassword}
                onConfirmNewPasswordChange={setConfirmNewPassword}
                onTogglePassword={() => setShowResetPassword((v) => !v)}
                onSubmit={handleResetSubmit}
                onBack={() => switchMode('forgot-email')}
                sentResetCode={sentResetCode}
              />
            )}

            {mode === 'recovered' && (
              <RecoveredState onBackToLogin={resetForgotFlowAndGoToLogin} />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
