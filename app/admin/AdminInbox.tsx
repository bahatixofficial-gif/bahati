"use client";

import { useState } from "react";
import Link from "next/link";

type SubmissionStatus = "new" | "read" | "archived";

type Submission = {
  id: string;
  type: "order" | "contact";
  status: SubmissionStatus;
  createdAt: string;
  data: Record<string, string>;
};

export default function AdminInbox({
  initialSubmissions,
}: {
  initialSubmissions: Submission[];
}) {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [typeFilter, setTypeFilter] = useState<"order" | "contact">("order");
  const [statusFilter, setStatusFilter] = useState<
    "active" | "new" | "read" | "archived"
  >("active");

  async function loadSubmissions() {
    const response = await fetch("/api/submissions", { cache: "no-store" });
    if (!response.ok) return;
    const result = await response.json();
    setSubmissions(result.submissions);
  }

  async function setSubmissionStatus(
    id: string,
    nextStatus: SubmissionStatus,
  ) {
    // Optimistically update UI immediately
    setSubmissions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: nextStatus } : item,
      ),
    );

    await fetch("/api/submissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        status: nextStatus,
      }),
    });

    await loadSubmissions();
  }

  const byType = submissions.filter((s) => s.type === typeFilter);

  const visibleSubmissions = byType.filter((submission) => {
    if (statusFilter === "active") return submission.status !== "archived";
    return submission.status === statusFilter;
  });

  const counts = {
    active: byType.filter((s) => s.status !== "archived").length,
    new: byType.filter((s) => s.status === "new").length,
    read: byType.filter((s) => s.status === "read").length,
    archived: byType.filter((s) => s.status === "archived").length,
  };

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
          <button className="admin-logout" type="submit">
            Sign out
          </button>
        </form>
      </div>

      {/* Primary Type Filter: Orders vs Questions */}
      <div className="admin-filters" aria-label="Filter submissions by type">
        {(
          [
            ["order", "Orders"],
            ["contact", "Questions"],
          ] as const
        ).map(([value, label]) => {
          const unreadCount = submissions.filter(
            (submission) =>
              submission.type === value && submission.status === "new",
          ).length;

          return (
            <button
              className={
                typeFilter === value ? "admin-filter active" : "admin-filter"
              }
              type="button"
              key={value}
              aria-pressed={typeFilter === value}
              onClick={() => setTypeFilter(value)}
            >
              {label}
              {unreadCount > 0 && <span>{unreadCount}</span>}
            </button>
          );
        })}
      </div>

      {/* Secondary Status Filter: Active / Unread / Read / Archived */}
      <div
        className="flex flex-wrap items-center gap-2 mb-6"
        aria-label="Filter submissions by status"
      >
        {(
          [
            ["active", "All Active", counts.active],
            ["new", "Unread", counts.new],
            ["read", "Read", counts.read],
            ["archived", "Archived", counts.archived],
          ] as const
        ).map(([value, label, count]) => {
          const isActive = statusFilter === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={isActive}
              onClick={() => setStatusFilter(value)}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider border transition-colors cursor-pointer flex items-center gap-2 [clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)] ${
                isActive
                  ? "!bg-white !text-black !border-white"
                  : "!bg-[#0e0e11] !text-white/70 !border-white/15 hover:!border-white/40 hover:!text-white"
              }`}
            >
              <span>{label}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-sm ${
                  isActive
                    ? "bg-black/15 text-black"
                    : "bg-white/10 text-white/60"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {visibleSubmissions.length === 0 ? (
        <p className="admin-empty">
          No {statusFilter === "active" ? "" : `${statusFilter} `}
          {typeFilter === "order" ? "orders" : "questions"} found.
        </p>
      ) : (
        <div className="submission-list">
          {visibleSubmissions.map((submission) => {
            const isArchived = submission.status === "archived";

            return (
              <article
                className={`submission-card ${
                  submission.status === "new" ? "new" : ""
                } ${isArchived ? "opacity-75" : ""}`}
                key={submission.id}
              >
                <div className="submission-meta">
                  <span className={`submission-type ${submission.type}`}>
                    {submission.type}
                  </span>
                  <span
                    className={`submission-status-dot ${submission.status}`}
                  >
                    {submission.status === "new"
                      ? "Unread"
                      : submission.status === "read"
                        ? "Read"
                        : "Archived"}
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
                        <strong>
                          {submission.data.discord || "Not provided"}
                        </strong>
                      </div>
                      <div className="submission-message">
                        <span>
                          {submission.data.subject || "General question"}
                        </span>
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
                        <strong>
                          {submission.data.service || "Not provided"}
                        </strong>
                      </div>
                      <div className="submission-person">
                        <span>Price</span>
                        <strong className="text-[#22c55e]">
                          {submission.data.price || "Not provided"}
                        </strong>
                      </div>
                      <div className="submission-person">
                        <span>Discord</span>
                        <strong>
                          {submission.data.discord || "Not provided"}
                        </strong>
                      </div>
                      <div className="submission-person">
                        <span>Email</span>
                        <strong>
                          {submission.data.email || "Not provided"}
                        </strong>
                      </div>
                      {submission.data.notes &&
                        submission.data.notes !== "-" && (
                          <div className="submission-message">
                            <span>Notes</span>
                            <p>{submission.data.notes}</p>
                          </div>
                        )}
                    </>
                  )}
                </div>

                {/* Action Buttons: Toggle Read/Unread + Archive/Restore */}
                <div className="flex flex-wrap items-center gap-2.5 mt-2">
                  {!isArchived && (
                    <button
                      className="submission-status"
                      type="button"
                      onClick={() =>
                        setSubmissionStatus(
                          submission.id,
                          submission.status === "new" ? "read" : "new",
                        )
                      }
                    >
                      Mark {submission.status === "new" ? "read" : "unread"}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      setSubmissionStatus(
                        submission.id,
                        isArchived ? "read" : "archived",
                      )
                    }
                    className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider border border-white/20 !bg-white/5 !text-white/80 hover:!bg-white hover:!text-black transition-colors cursor-pointer [clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)]"
                  >
                    {isArchived ? "Restore to Inbox" : "Archive"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}