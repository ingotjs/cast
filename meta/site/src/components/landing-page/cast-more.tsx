export function CastMore() {
  return (
    <section className="more">
      <div className="more-inner">
        <div className="section-header">
          <h2>And more</h2>
          <p>Everything you need, already wired up.</p>
        </div>
        <div className="more-grid">
          <div className="more-item animate-on-scroll">
            <div className="more-item-img">{/* TODO: add OG image screenshot */}</div>
            <div className="more-item-body">
              <h3>Dynamic OG Images with i18n</h3>
              <p>
                Auto-generated Open Graph images per page with full internationalization support. Every route gets a
                unique, localized social preview out of the box.
              </p>
            </div>
          </div>
          <div className="more-item animate-on-scroll">
            <div className="more-item-img">{/* TODO: add email template screenshot */}</div>
            <div className="more-item-body">
              <h3>Transactional Emails</h3>
              <p>
                React Email templates with Resend, fully i18n-ready. Welcome emails, password resets, magic links —
                styled, tested, and localized.
              </p>
            </div>
          </div>
          <div className="more-item animate-on-scroll">
            <div className="more-item-img">{/* TODO: add auth screenshot */}</div>
            <div className="more-item-body">
              <h3>Auth That Just Works</h3>
              <p>
                Email/password, passkeys, Google OAuth, magic links, and admin roles. Session storage on Cloudflare KV
                with rate limiting built in.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
