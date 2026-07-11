import { useState } from 'react';
import { useNavigate } from 'react-router';
import { handleLogin } from './login';
type LoginFormProps = {
  loginEmail: string;
  loginPassword: string;
  showLoginPassword: boolean;
  loginErrors: Record<string, string>;
  loginLoading: boolean;
  loginSuccessMsg: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onForgotPassword: () => void;
};

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

export function LoginForm({
  loginEmail,
  loginPassword,
  showLoginPassword,
  loginErrors,
  loginLoading,
  loginSuccessMsg,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onSubmit,
  onForgotPassword,
}: LoginFormProps) {
  const navigate = useNavigate();
  const [loginMessage, setLoginMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  return (
    

    <>
      <div className="panel-head">
        <span className="panel-eyebrow">WELCOME BACK</span>
        <h1 className="panel-title">Log in to your account</h1>
      </div>

      <form noValidate onSubmit={onSubmit} className="auth-form">
        <div className="field">
          <label htmlFor="login-email">Email address</label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={loginEmail}
            onChange={(e) => onEmailChange(e.target.value)}
            className={loginErrors.email ? 'has-error' : ''}
          />
          {loginErrors.email && <span className="field-error">{loginErrors.email}</span>}
        </div>

        <div className="field">
          <label htmlFor="login-password">Password</label>
          <div className="password-wrap">
            <input
              id="login-password"
              type={showLoginPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              value={loginPassword}
              onChange={(e) => onPasswordChange(e.target.value)}
              className={loginErrors.password ? 'has-error' : ''}
            />
            <button
              type="button"
              className="toggle-visibility"
              onClick={onTogglePassword}
              aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
            >
              <EyeIcon open={showLoginPassword} />
            </button>
          </div>
          {loginErrors.password && <span className="field-error">{loginErrors.password}</span>}
        </div>

        <button type="button" className="link-button forgot-link" onClick={onForgotPassword}>
          Forgot your password?
        </button>

        <button
          type="submit"
          className="submit-button"
          disabled={loginLoading || submitting}
          onClick={handleLogin(
            loginEmail,
            loginPassword,
            submitting,
            setLoginMessage,
            setSubmitting,
            navigate
          )}
        >
          {loginLoading || submitting ? <Spinner /> : 'Log In'}
        </button>

        {loginMessage && <p className="field-error" style={{ marginTop: '0.75rem' }}>{loginMessage}</p>}
        {loginSuccessMsg && <p className="inline-success">{loginSuccessMsg}</p>}
      </form>
    </>
  );
}
