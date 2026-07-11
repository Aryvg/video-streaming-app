import { useState } from 'react';
import { handlePostClick } from './Postrequesttoforgotpass';

type ForgotEmailFormProps = {
  forgotEmail: string;
  forgotErrors: Record<string, string>;
  forgotLoading: boolean;
  onEmailChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onBackToLogin: () => void;
  onEmailVerified: (code: string) => void;
};

function Spinner() {
  return <span className="spinner" aria-hidden="true" />;
}

export function ForgotEmailForm({
  forgotEmail,
  forgotErrors,
  forgotLoading,
  onEmailChange,
  onSubmit,
  onBackToLogin,
  onEmailVerified,
}: ForgotEmailFormProps) {
  const [emailStatus, setEmailStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  return (
    <>
      <button type="button" className="back-button" onClick={onBackToLogin}>
        <span aria-hidden="true">&larr;</span> Back to log in
      </button>
      <div className="panel-head">
        <span className="panel-eyebrow">ACCOUNT RECOVERY</span>
        <h1 className="panel-title">Reset your password</h1>
        <p className="panel-subtitle">
          Enter the email linked to your account and we&rsquo;ll send you a recovery code.
        </p>
      </div>
      <form noValidate onSubmit={onSubmit} className="auth-form">
        <div className="field">
          <label htmlFor="forgot-email">Email address</label>
          <input
            id="forgot-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={forgotEmail}
            onChange={(e) => {
              onEmailChange(e.target.value);
              setEmailStatus(null);
            }}
            className={forgotErrors.email ? 'has-error' : ''}
          />
          {forgotErrors.email && <span className="field-error">{forgotErrors.email}</span>}
          {emailStatus && (
            <span
              style={{ color: emailStatus.type === 'success' ? 'green' : 'red', marginTop: '6px', display: 'block' }}
            >
              {emailStatus.message}
            </span>
          )}
        </div>
        <button type="submit" className="submit-button" disabled={forgotLoading}
          onClick={handlePostClick(forgotEmail, (message, type) => setEmailStatus({ message, type }), onEmailVerified)}
        >
          {forgotLoading ? <Spinner /> : 'Send Recovery Code'}
        </button>
      </form>
    </>
  );
}
