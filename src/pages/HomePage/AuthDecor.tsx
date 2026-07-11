function GlobeDecoration() {
  return (
    <svg
      className="decor-globe"
      viewBox="0 0 200 200"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="100" cy="100" r="78" className="decor-globe__body" />
      <ellipse cx="100" cy="100" rx="78" ry="30" className="decor-globe__line" />
      <ellipse cx="100" cy="100" rx="78" ry="55" className="decor-globe__line" />
      <ellipse cx="100" cy="100" rx="30" ry="78" className="decor-globe__line" />
      <ellipse cx="100" cy="100" rx="55" ry="78" className="decor-globe__line" />
      <circle cx="100" cy="100" r="78" className="decor-globe__outline" />
      <circle cx="47" cy="60" r="3.2" className="decor-globe__dot" />
      <circle cx="140" cy="82" r="2.4" className="decor-globe__dot" />
      <circle cx="118" cy="140" r="2.8" className="decor-globe__dot" />
      <circle cx="70" cy="132" r="2" className="decor-globe__dot" />
    </svg>
  );
}

export function AuthDecor() {
  return (
    <aside className="auth-card__decor" aria-hidden="true">
      <span className="decor-eyebrow">GLOBAL ACCESS PASS</span>
      <GlobeDecoration />
      <h2 className="decor-title">
        Every border,
        <br />
        one passport.
      </h2>
      <p className="decor-copy">
        Sign in to continue your journey, or create an account and get your pass stamped for the
        first time.
      </p>
      <div className="decor-footer">
        <span className="decor-footer__dash" />
        <span>ISSUED FOR ALL DESTINATIONS</span>
      </div>
    </aside>
  );
}
