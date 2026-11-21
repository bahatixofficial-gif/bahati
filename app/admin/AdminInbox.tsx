"use client";

import { useState } from "react";
import Link from "next/link";

type Submission = {
  id: string;
  type: "order" | "contact";
  status: "new" | "read";
  createdAt: string;
  data: Record<string, string>;
};

export default function AdminInbox({
  initialSubmissions,
}: {
  initialSubmissions: Submission[];
}) {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [filter, setFilter] = useState<"order" | "contact">("order");

  async function loadSubmissions() {
    const response = await fetch("/api/submissions", { cache: "no-store" });
    if (!response.ok) return;
    const result = await response.json();
    setSubmissions(result.submissions);
  }

  async function updateStatus(submission: Submission) {
    await fetch("/api/submissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: submission.id,
        status: submission.status === "new" ? "read" : "new",
      }),
    });
    await loadSubmissions();
  }

  const visibleSubmissions = submissions.filter((submission) => {
    return submission.type === filter;
  });

  return (
    <section className="admin-inbox">
      <div className="admin-heading">
        <Link className="admin-brand" href="/" aria-label="Return to BAHATI home">
          <span className="brand-mark" aria-hidden="true">
            <span className="brand-monogram">B</span>
          </span>
          <span className="brand-name">BAHATI</span>
        </Link>
        <span className="page-eyebrow">Private dashboard</span>
        <form action="/api/auth/logout" method="post">
          <button className="admin-logout" type="submit">Sign out</button>
        </form>
      </div>

      <div className="admin-filters" aria-label="Filter submissions">
        {([
          ["order", "Orders"],
          ["contact", "Questions"],
        ] as const).map(([value, label]) => (
          <button
            className={filter === value ? "admin-filter active" : "admin-filter"}
            type="button"
            key={value}
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
          >
            {label}
            {submissions.filter(
              (submission) =>
                submission.type === value && submission.status === "new",
            ).length > 0 && (
              <span>
                {submissions.filter(
                  (submission) =>
                    submission.type === value && submission.status === "new",
                ).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {visibleSubmissions.length === 0 ? (
        <p className="admin-empty">No submissions yet.</p>
      ) : (
        <div className="submission-list">
          {visibleSubmissions.map((submission) => (
            <article
              className={`submission-card ${submission.status === "new" ? "new" : ""}`}
              key={submission.id}
            >
              <div className="submission-meta">
                <span className={`submission-type ${submission.type}`}>
                  {submission.type}
                </span>
                <span className={`submission-status-dot ${submission.status}`}>
                  {submission.status === "new" ? "Unread" : "Read"}
                </span>
                <time dateTime={submission.createdAt}>
                  {new Date(submission.createdAt).toLocaleString()}
                </time>
              </div>
              <div className="submission-details">
                {submission.type === "contact" ? (
                  <>
                    <div className="submission-person">
                      <span>Name</span>
                      <strong>{submission.data.name || "Not provided"}</strong>
                    </div>
                    <div className="submission-person">
                      <span>Discord</span>
                      <strong>{submission.data.discord || "Not provided"}</strong>
                    </div>
                    <div className="submission-message">
                      <span>{submission.data.subject || "General question"}</span>
                      <p>{submission.data.message || "-"}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="submission-person">
                      <span>Hero</span>
                      <strong>{submission.data.hero || "Not provided"}</strong>
                    </div>
                    <div className="submission-person">
                      <span>Service</span>
                      <strong>{submission.data.service || "Not provided"}</strong>
                    </div>
                    <div className="submission-person">
                      <span>Email</span>
                      <strong>{submission.data.email || "Not provided"}</strong>
                    </div>
                  </>
                )}
              </div>
              <button
                className="submission-status"
                type="button"
                onClick={() => updateStatus(submission)}
              >
                Mark {submission.status === "new" ? "read" : "new"}
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
