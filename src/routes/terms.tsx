import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Widely" },
      { name: "description", content: "The rules and terms governing use of the Widely platform." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
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
          <h1 className="text-4xl font-bold mt-2 mb-3">Terms of Service</h1>
          <p className="text-muted-foreground text-sm">Effective date: 26 May 2026 · Last updated: 26 May 2026</p>
        </div>

        <div className="prose prose-sm max-w-none space-y-8 text-foreground">

          <Section title="1. Acceptance of terms">
            <p>
              By creating an account or using Widely ("Service", "Platform"), you agree to be bound by these
              Terms of Service ("Terms"). If you do not agree, do not use Widely.
            </p>
            <p>
              Widely is operated by Mohamed Hassan Allam, Berlin, Germany. Contact:{" "}
              <a href="mailto:hello@widely.app" className="underline underline-offset-4 hover:text-primary transition">hello@widely.app</a>
            </p>
          </Section>

          <Section title="2. Your account">
            <ul>
              <li>You must be at least 16 years old to create an account.</li>
              <li>You are responsible for maintaining the security of your account credentials and API keys.</li>
              <li>You are responsible for all activity that occurs under your account, including actions taken by automated scripts or AI agents using your API key.</li>
              <li>You must provide accurate information when signing up. Using a fake email or impersonating another person is grounds for immediate termination.</li>
              <li>You may not create more than one account per person without explicit written permission.</li>
            </ul>
          </Section>

          <Section title="3. Acceptable use">
            <p>You agree <strong>not</strong> to use Widely to:</p>
            <ul>
              <li>Post links to illegal content, malware, phishing sites, or sites that distribute pirated material</li>
              <li>Impersonate any person, brand, or organization you do not have authority to represent</li>
              <li>Distribute spam, unsolicited commercial messages, or engage in mass automated profile creation</li>
              <li>Conduct denial-of-service attacks against Widely or any linked platform</li>
              <li>Violate any applicable laws or regulations, including export controls and sanctions</li>
              <li>Circumvent, disable, or interfere with security features of the Service</li>
              <li>Scrape Widely profiles at scale without prior written consent</li>
              <li>Harvest email addresses or other personal data from public profiles</li>
            </ul>
            <p>
              We reserve the right to suspend or terminate any account that violates these rules, at our
              sole discretion and without prior notice.
            </p>
          </Section>

          <Section title="4. API and MCP usage">
            <p>
              Widely provides a REST API and an official MCP server package (<code className="bg-secondary px-1 py-0.5 rounded text-xs">@widely/mcp</code>).
              By using the API or MCP server, you additionally agree to:
            </p>
            <ul>
              <li>Keep your API key confidential. Do not commit it to public repositories.</li>
              <li>Not share your API key with third parties or use it to provide a competing service.</li>
              <li>Respect rate limits. Excessive requests that degrade service for others may result in key revocation.</li>
              <li>Not attempt to reverse-engineer, probe, or exploit the API beyond its documented capabilities.</li>
            </ul>
            <p>
              API rate limits may be enforced at our discretion. We will provide reasonable notice before
              implementing hard limits for existing users.
            </p>
          </Section>

          <Section title="5. Your content">
            <p>
              You retain full ownership of the content you add to Widely (profile text, link titles, URLs, images).
              By uploading content, you grant Widely a limited, non-exclusive, royalty-free licence to store,
              display, and deliver that content as part of operating the Service (e.g., serving your public
              profile page to visitors).
            </p>
            <p>
              You are solely responsible for ensuring the content you link to does not infringe third-party
              intellectual property rights or violate applicable law. We will respond to valid DMCA takedown
              notices sent to{" "}
              <a href="mailto:hello@widely.app" className="underline underline-offset-4 hover:text-primary transition">hello@widely.app</a>.
            </p>
          </Section>

          <Section title="6. Public profiles">
            <p>
              Your Widely profile (e.g., <code className="bg-secondary px-1 py-0.5 rounded text-xs">widely.app/yourhandle</code>) is
              publicly accessible by default. Visitors can view your profile and click your links without an account.
              Click counts are tracked as aggregate numbers — we do not store visitor personal data.
            </p>
            <p>
              Do not use your public profile to link to content that is harmful, illegal, or violates these Terms.
            </p>
          </Section>

          <Section title="7. Availability and modifications">
            <p>
              We aim for high availability but do not guarantee uninterrupted service. We reserve the right to:
            </p>
            <ul>
              <li>Modify, suspend, or discontinue the Service (or any part of it) at any time</li>
              <li>Modify these Terms at any time — we will notify users by email for material changes</li>
              <li>Change or introduce pricing for the Service — existing free-tier commitments will be honoured with at least 30 days notice</li>
            </ul>
            <p>
              Continued use of Widely after a Terms update constitutes acceptance of the revised Terms.
            </p>
          </Section>

          <Section title="8. Termination">
            <p>
              You may delete your account at any time. We may suspend or terminate your account immediately
              if you violate these Terms. Upon termination, your public profile will be taken offline and
              your data will be deleted within 30 days per our Privacy Policy.
            </p>
            <p>
              We reserve the right to reclaim your username after account deletion.
            </p>
          </Section>

          <Section title="9. Disclaimer of warranties">
            <p>
              Widely is provided <strong>"as is"</strong> and <strong>"as available"</strong> without warranties of any kind,
              express or implied, including but not limited to warranties of merchantability, fitness for a
              particular purpose, or non-infringement. We do not warrant that the Service will be error-free,
              uninterrupted, or that defects will be corrected.
            </p>
          </Section>

          <Section title="10. Limitation of liability">
            <p>
              To the maximum extent permitted by applicable law, Widely and its operator shall not be liable
              for any indirect, incidental, special, consequential, or punitive damages arising from your use
              of or inability to use the Service — including but not limited to loss of data, loss of revenue,
              or business interruption — even if advised of the possibility of such damages.
            </p>
            <p>
              Our total liability for any claim arising out of these Terms or the Service shall not exceed
              the amount you paid us (if any) in the 12 months preceding the claim.
            </p>
          </Section>

          <Section title="11. Governing law">
            <p>
              These Terms are governed by the laws of the Federal Republic of Germany, without regard to its
              conflict-of-law provisions. For users in the EU, mandatory consumer protection laws of your
              country of residence also apply. Any disputes shall be subject to the exclusive jurisdiction
              of the courts of Berlin, Germany, unless mandatory local law requires otherwise.
            </p>
          </Section>

          <Section title="12. Contact">
            <p>
              For legal notices, abuse reports, DMCA requests, or any questions about these Terms, contact:{" "}
              <a href="mailto:hello@widely.app" className="underline underline-offset-4 hover:text-primary transition">hello@widely.app</a>
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
      <div className="space-y-3 text-sm text-muted-foreground leading-relaxed [&_strong]:text-foreground [&_a]:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_code]:font-mono">
        {children}
      </div>
    </section>
  );
}
