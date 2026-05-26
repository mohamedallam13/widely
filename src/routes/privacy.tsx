import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Widely" },
      { name: "description", content: "How Widely collects, stores, and protects your data." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <header className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between border-b border-border">
        <Link to="/" className="shrink-0">
          <img src="/logo.png" alt="Widely" className="h-10 w-auto" />
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link to="/login" className="px-4 py-2 rounded-full hover:bg-secondary transition font-medium">Log in</Link>
          <Link to="/signup" className="rounded-full bg-primary px-5 py-2 text-primary-foreground font-medium hover:opacity-90 transition">Sign up free</Link>
        </nav>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Legal</span>
          <h1 className="text-4xl font-bold mt-2 mb-3">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm">Effective date: 26 May 2026 · Last updated: 26 May 2026</p>
        </div>

        <div className="prose prose-sm max-w-none space-y-8 text-foreground">

          <Section title="1. Who we are">
            <p>
              Widely ("we", "us", "our") is a programmable link-in-bio platform operated by Mohamed Hassan Allam,
              based in Berlin, Germany. Our website is <strong>widely.app</strong>.
            </p>
            <p>
              For any privacy-related questions, contact us at:{" "}
              <a href="mailto:hello@widely.app" className="underline underline-offset-4 hover:text-primary transition">hello@widely.app</a>
            </p>
          </Section>

          <Section title="2. What data we collect">
            <p>We collect only what is necessary to provide the service:</p>
            <Table
              headers={["Category", "Data", "Purpose"]}
              rows={[
                ["Account", "Email address, hashed password (via Supabase Auth)", "Authentication & account management"],
                ["Profile", "Display name, bio, profile picture URL, theme preference, social links", "Building your public profile page"],
                ["Links", "Link titles, URLs, visibility settings, click counts, cover image URLs", "Powering your link-in-bio page"],
                ["API Keys", "Hashed API key tokens, labels, last-used timestamps", "Authenticating API and MCP requests"],
                ["Technical", "IP address, browser type, referrer (server logs, Cloudflare)", "Security, abuse prevention, analytics"],
                ["Cookies", "Session cookie (Supabase auth token)", "Keeping you logged in"],
              ]}
            />
          </Section>

          <Section title="3. Cookies">
            <p>
              Widely uses <strong>only functional cookies</strong> — specifically a single session cookie set by Supabase
              to keep you authenticated. We do <strong>not</strong> use advertising cookies, third-party tracking pixels,
              or analytics cookies that require consent under GDPR/ePrivacy.
            </p>
            <p>
              You can delete this cookie at any time by logging out. Blocking it will prevent login from working.
            </p>
          </Section>

          <Section title="4. How we use your data">
            <ul>
              <li>To provide and operate the Widely platform</li>
              <li>To authenticate you and secure your account</li>
              <li>To serve your public profile page to visitors</li>
              <li>To count link clicks and return those counts via the API</li>
              <li>To detect and prevent abuse, fraud, and unauthorized API access</li>
              <li>To contact you about important service changes (no marketing without consent)</li>
            </ul>
            <p>
              We do <strong>not</strong> sell your data, share it with advertisers, or use it for profiling.
            </p>
          </Section>

          <Section title="5. Legal basis for processing (GDPR)">
            <p>For users in the European Economic Area, our legal bases are:</p>
            <ul>
              <li><strong>Contract performance (Art. 6(1)(b)):</strong> Processing your account and profile data to deliver the service you signed up for.</li>
              <li><strong>Legitimate interests (Art. 6(1)(f)):</strong> Server logs and security monitoring to protect the platform and users.</li>
              <li><strong>Consent (Art. 6(1)(a)):</strong> Any optional features that involve additional data collection (we will ask explicitly).</li>
            </ul>
          </Section>

          <Section title="6. Data storage & sub-processors">
            <Table
              headers={["Sub-processor", "Role", "Location"]}
              rows={[
                ["Supabase", "Database, authentication, file storage", "EU (Frankfurt, Germany)"],
                ["Cloudflare Workers", "Hosting, CDN, edge compute", "Global CDN / EU entry points"],
              ]}
            />
            <p>
              Both sub-processors provide GDPR-compliant data processing agreements. Your data is stored
              primarily in the EU (Frankfurt region on Supabase).
            </p>
          </Section>

          <Section title="7. Data retention">
            <ul>
              <li><strong>Active accounts:</strong> Retained as long as your account exists.</li>
              <li><strong>Deleted accounts:</strong> Permanently deleted within 30 days of account deletion request.</li>
              <li><strong>Server logs:</strong> Retained for up to 30 days, then purged.</li>
              <li><strong>Link click counts:</strong> Aggregated counts retained; no individual visitor data stored.</li>
            </ul>
          </Section>

          <Section title="8. Your rights (GDPR)">
            <p>If you are in the EEA, you have the right to:</p>
            <ul>
              <li><strong>Access</strong> — request a copy of all data we hold about you</li>
              <li><strong>Rectification</strong> — correct inaccurate data (you can edit most of it directly in the app)</li>
              <li><strong>Erasure</strong> — request deletion of your account and all associated data</li>
              <li><strong>Portability</strong> — receive your data in a machine-readable format</li>
              <li><strong>Restriction</strong> — request we limit processing while a dispute is resolved</li>
              <li><strong>Object</strong> — object to processing based on legitimate interests</li>
            </ul>
            <p>
              To exercise any of these rights, email us at{" "}
              <a href="mailto:hello@widely.app" className="underline underline-offset-4 hover:text-primary transition">hello@widely.app</a>.
              We will respond within 30 days.
            </p>
            <p>
              You also have the right to lodge a complaint with your local data protection authority (e.g.,{" "}
              <a href="https://www.bfdi.bund.de" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-primary transition">BfDI in Germany</a>).
            </p>
          </Section>

          <Section title="9. Security">
            <p>
              We implement industry-standard security measures: TLS encryption in transit, hashed passwords,
              hashed API keys (we never store the plaintext token after generation), and access controls
              enforced via Supabase Row Level Security (RLS). No system is 100% secure — if you believe
              there is a security issue, please contact us immediately at{" "}
              <a href="mailto:hello@widely.app" className="underline underline-offset-4 hover:text-primary transition">hello@widely.app</a>.
            </p>
          </Section>

          <Section title="10. Third-party links">
            <p>
              Your Widely profile contains links to external websites. We are not responsible for the privacy
              practices of those sites. The presence of a link does not constitute endorsement.
            </p>
          </Section>

          <Section title="11. Children">
            <p>
              Widely is not directed at children under 16. We do not knowingly collect personal data from
              anyone under 16. If you believe we have done so in error, contact us and we will delete it
              immediately.
            </p>
          </Section>

          <Section title="12. Changes to this policy">
            <p>
              We may update this Privacy Policy from time to time. We will notify registered users by email
              for material changes. The "Last updated" date at the top of this page will always reflect the
              most recent revision. Continued use of Widely after an update constitutes acceptance of the
              revised policy.
            </p>
          </Section>

        </div>
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-4">
          <span>Widely © 2026</span>
          <span>·</span>
          <Link to="/privacy" className="hover:text-foreground transition">Privacy</Link>
          <span>·</span>
          <Link to="/terms" className="hover:text-foreground transition">Terms</Link>
        </div>
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold border-b border-border pb-2">{title}</h2>
      <div className="space-y-3 text-sm text-muted-foreground leading-relaxed [&_strong]:text-foreground [&_a]:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
        {children}
      </div>
    </section>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-secondary/50">
            {headers.map((h) => (
              <th key={h} className="text-left px-4 py-2.5 font-semibold text-foreground">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-border">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2.5 align-top">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
