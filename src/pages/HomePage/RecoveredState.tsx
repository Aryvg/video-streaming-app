type RecoveredStateProps = {
  onBackToLogin: () => void;
};

export function RecoveredState({ onBackToLogin }: RecoveredStateProps) {
  return (
    <div className="success-block">
      <div className="stamp-badge" role="img" aria-label="RECOVERED">
        <span className="stamp-badge__ring stamp-badge__ring--outer" />
        <span className="stamp-badge__ring stamp-badge__ring--inner" />
        <span className="stamp-badge__label">RECOVERED</span>
      </div>
      <h2 className="success-title">Your account is recovered</h2>
      <p className="success-copy">
        Your password has been updated. You can now log in with your new password.
      </p>
      <button type="button" className="submit-button" onClick={onBackToLogin}>
        Back to Log In
      </button>
    </div>
  );
}
