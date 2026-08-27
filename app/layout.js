import "./globals.css";

export const metadata = {
  title: {
    default: "Hunger Tokens — Standup Appetite Dashboard",
    template: "%s | Hunger Tokens",
  },
  description:
    "Paste daily standup notes, parse progress and blockers, and track team hunger with a local-first dashboard.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fff7ed",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="app-shell">
        <a className="skip-link" href="#main-content">
          Skip to dashboard
        </a>

        <div className="page-shell">
          <header className="page-header">
            <div className="brand">
              <span className="brand-mark" aria-hidden="true">
                🍳
              </span>
              <div>
                <p className="brand-kicker">Standup Appetite</p>
                <h1 className="brand-title">Hunger Tokens</h1>
              </div>
            </div>

            <p className="page-tagline">
              Turn yesterday, today, and blockers into a team stomach that can be fed.
            </p>
          </header>

          <main id="main-content" className="page-main">
            {children}
          </main>

          <footer className="page-footer">
            <p>
              Local-first dashboard · standup notes, blockers, and coupons stay in your browser.
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}