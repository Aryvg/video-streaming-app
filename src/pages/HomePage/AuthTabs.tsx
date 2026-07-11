type Mode = 'login' | 'signup' | 'forgot-email' | 'forgot-reset' | 'recovered';

type AuthTabsProps = {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
};

export function AuthTabs({ mode, onModeChange }: AuthTabsProps) {
  if (mode !== 'login' && mode !== 'signup') {
    return null;
  }

  return (
    <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'login'}
        className={`auth-tab ${mode === 'login' ? 'auth-tab--active' : ''}`}
        onClick={() => onModeChange('login')}
      >
        Log In
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'signup'}
        className={`auth-tab ${mode === 'signup' ? 'auth-tab--active' : ''}`}
        onClick={() => onModeChange('signup')}
      >
        Sign Up
      </button>
      <span
        className="auth-tabs__thumb"
        style={{ transform: mode === 'signup' ? 'translateX(100%)' : 'translateX(0%)' }}
        aria-hidden="true"
      />
    </div>
  );
}
