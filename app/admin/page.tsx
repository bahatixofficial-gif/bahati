import { Suspense } from "react";
import Link from "next/link";
import { getAdminSession } from "../lib/admin-session";
import { getSubmissions } from "../lib/submissions";
import AdminInbox from "./AdminInbox";

async function AdminContent({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getAdminSession();
  const { error } = await searchParams;

  if (!session) {
    const messages: Record<string, string> = {
      invalid_state: "The Google login session expired. Please try again.",
      not_configured: "Google login is not configured yet.",
      google_login_failed: "Google login could not be completed.",
      google_profile_failed: "Google profile information could not be loaded.",
      unauthorized: "Only the configured Gmail account can access this dashboard.",
    };

    return (
      <main className="admin-login-page">
        <section className="admin-login-card">
          <Link className="admin-brand" href="/" aria-label="Return to BAHATI home">
            <span className="brand-mark" aria-hidden="true">
              <span className="brand-monogram">B</span>
            </span>
            <span className="brand-name">BAHATI</span>
          </Link>
          <span className="page-eyebrow">Private area</span>
          <h1>BAHATI Admin</h1>
          {error && <p className="admin-error">{messages[error] || "Login failed."}</p>}
          <Link className="google-login" href="/api/auth/google">
            Sign in with Google
          </Link>
        </section>
      </main>
    );
  }

  const submissions = await getSubmissions();
  return (
    <main className="admin-page">
      <AdminInbox initialSubmissions={submissions} />
    </main>
  );
}

export default function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <Suspense fallback={<main className="admin-page" />}>
      <AdminContent searchParams={searchParams} />
    </Suspense>
  );
}
