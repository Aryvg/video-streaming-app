import { handlePostClickForReset, isResetCodeMatching } from './postRequesttoresetpass';
type ResetPasswordFormProps = {
  forgotEmail: string;
  resetCode: string;
  newPassword: string;
  confirmNewPassword: string;
  showResetPassword: boolean;
  resetErrors: Record<string, string>;
  resetLoading: boolean;
  sentResetCode: string;
  onCodeChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onConfirmNewPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
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

export function ResetPasswordForm({
  forgotEmail,
  resetCode,
  newPassword,
  confirmNewPassword,
  showResetPassword,
  resetErrors,
  resetLoading,
  sentResetCode,
  onCodeChange,
  onNewPasswordChange,
  onConfirmNewPasswordChange,
  onTogglePassword,
  onSubmit,
  onBack,
}: ResetPasswordFormProps) {
  const codeMatch = sentResetCode ? isResetCodeMatching(resetCode, sentResetCode) : false;
  const codeFeedback = resetCode.trim().length > 0 && sentResetCode ? (codeMatch ? 'Codes are similar.' : 'Codes are not similar.') : '';
  const codeFeedbackColor = codeMatch ? 'green' : 'red';

  return (
    <>
      <button type="button" className="back-button" onClick={onBack}>
        <span aria-hidden="true">&larr;</span> Back
      </button>
      <div className="panel-head">
        <span className="panel-eyebrow">CHECK YOUR INBOX</span>
        <h1 className="panel-title">Enter your new password</h1>
        <p className="panel-subtitle">
          We sent a 6-digit code to <strong>{forgotEmail || 'your email'}</strong>. Enter it below
          along with your new password.
        </p>
      </div>
      <form noValidate onSubmit={onSubmit} className="auth-form">
        <div className="field">
          <label htmlFor="reset-code">Recovery code</label>
          <input
            id="reset-code"
            type="text"
            inputMode="numeric"
            placeholder="123456"
            maxLength={6}
            value={resetCode}
            onChange={(e) => onCodeChange(e.target.value)}
            className={resetErrors.code ? 'has-error' : ''}
          />
          {resetErrors.code && <span className="field-error">{resetErrors.code}</span>}
          {codeFeedback && (
            <span style={{ color: codeFeedbackColor, marginTop: '6px', display: 'block' }}>
              {codeFeedback}
            </span>
          )}
        </div>

        <div className="field">
          <label htmlFor="reset-new-password">New password</label>
          <div className="password-wrap">
            <input
              id="reset-new-password"
              type={showResetPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => onNewPasswordChange(e.target.value)}
              className={resetErrors.newPassword ? 'has-error' : ''}
            />
            <button
              type="button"
              className="toggle-visibility"
              onClick={onTogglePassword}
              aria-label={showResetPassword ? 'Hide password' : 'Show password'}
            >
              <EyeIcon open={showResetPassword} />
            </button>
          </div>
          {resetErrors.newPassword && <span className="field-error">{resetErrors.newPassword}</span>}
        </div>

        <div className="field">
          <label htmlFor="reset-confirm-password">Confirm new password</label>
          <input
            id="reset-confirm-password"
            type={showResetPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="••••••••"
            value={confirmNewPassword}
            onChange={(e) => onConfirmNewPasswordChange(e.target.value)}
            className={resetErrors.confirmNewPassword ? 'has-error' : ''}
          />
          {resetErrors.confirmNewPassword && (
            <span className="field-error">{resetErrors.confirmNewPassword}</span>
          )}
        </div>

        <button type="submit" className="submit-button" disabled={resetLoading || !codeMatch}
        onClick={handlePostClickForReset(
            forgotEmail,
            resetCode,
            newPassword,
            confirmNewPassword
          )}
        >
          
          {resetLoading ? <Spinner /> : 'Reset Password'}
        </button>
      </form>
    </>
  );
}
