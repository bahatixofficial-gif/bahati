"use client";

import { useState } from "react";

const CONTACT_INFO = {
  discordUsername: "bahati.gg",
  discordId: "1260018273664372922",
  email: "bahatixofficial@gmail.com",
  discordServerName: "Sinners",
  discordServerInvite: "https://discord.com",
};

const FAQS = [
  {
    question: "How long does a Lordboost (Level 1 to 55) take?",
    answer:
      "Most full 1 to 55 Lordboosts are completed within 1 to 2 weeks depending on hero availability and queue times. Smaller level ranges are often finished the same day.",
  },
  {
    question: "Is my account safe during a boost?",
    answer:
      "Yes. All orders are played 100% by hand with zero cheats, scripts, or third-party tools. You can also request live stream updates or progress screenshots in Discord.",
  },
  {
    question: "Why do prices vary depending on the hero tier?",
    answer:
      "Certain heroes require significantly longer proficiency milestones or stats requirements. Message on Discord before or after submitting an order if you want to confirm exact hero tier pricing.",
  },
  {
    question: "Can I play on my account while an order is active?",
    answer:
      "To avoid overlapping logins or disrupting match streaks, please coordinate via Discord DM before logging in while your boost is in progress.",
  },
  {
    question: "How do payments and order confirmation work?",
    answer:
      "Once you submit an order on the site, we will DM you on Discord within minutes to confirm your hero, schedule, and payment method before starting.",
  },
  {
    question: "Do you boost on both PC and Console?",
    answer:
      "Yes—include your platform (PC, PlayStation, or Xbox) in the order notes or mention it when we message you on Discord.",
  },
];

export default function ContactsBoard() {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const displayFont = {
    fontFamily: "var(--font-display), sans-serif",
  };

  const bodyFont = {
    fontFamily: "var(--font-body), sans-serif",
  };

  const copyToClipboard = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(key);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Fallback ignored if clipboard permissions are blocked
    }
  };

  const cardClass =
    "bg-[#0e0e11] border border-white/15 hover:border-white/30 transition-colors p-5 sm:p-6 flex flex-col justify-between gap-4 [clip-path:polygon(10px_0,100%_0,100%_calc(100%-10px),calc(100%-10px)_100%,0_100%,0_10px)]";

  const mailtoHref = `mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent("BAHATI Lordboost Inquiry")}`;

  return (
    <div style={bodyFont} className="flex flex-col gap-12 w-full max-w-5xl">
      {/* TOP SECTION: Direct Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Discord Username */}
        <div className={cardClass}>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium uppercase tracking-wider text-white/55">
              Discord Username
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#22c55e] bg-[#22c55e]/10 border border-[#22c55e]/30 px-2.5 py-0.5 shrink-0 [clip-path:polygon(4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%,0_4px)]">
              Fastest Reply
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <strong className="text-lg sm:text-xl font-semibold text-white truncate">
              {CONTACT_INFO.discordUsername}
            </strong>
            <button
              type="button"
              onClick={() =>
                copyToClipboard("username", CONTACT_INFO.discordUsername)
              }
              className="px-3.5 py-1.5 !bg-white/10 !text-white hover:!bg-white hover:!text-black border border-white/20 text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 cursor-pointer [clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)]"
            >
              {copiedField === "username" ? "Copied ✓" : "Copy"}
            </button>
          </div>
        </div>

        {/* Discord User ID */}
        <div className={cardClass}>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium uppercase tracking-wider text-white/55">
              Discord User ID
            </span>
            <span className="text-[11px] font-medium uppercase tracking-wider text-white/45 shrink-0">
              Verify Identity
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <code className="text-sm sm:text-base font-medium tracking-wide text-white/90 bg-black/60 border border-white/10 px-3 py-1.5 truncate">
              {CONTACT_INFO.discordId}
            </code>
            <button
              type="button"
              onClick={() => copyToClipboard("id", CONTACT_INFO.discordId)}
              className="px-3.5 py-1.5 !bg-white/10 !text-white hover:!bg-white hover:!text-black border border-white/20 text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 cursor-pointer [clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)]"
            >
              {copiedField === "id" ? "Copied ✓" : "Copy ID"}
            </button>
          </div>
        </div>

        {/* Email — Opens user's email app with your email as recipient */}
        <div className={cardClass}>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium uppercase tracking-wider text-white/55">
              Direct Email
            </span>
            <span className="text-[11px] font-medium uppercase tracking-wider text-white/45 shrink-0">
              Business &amp; Support
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <a
              href={mailtoHref}
              className="text-base sm:text-lg font-semibold !text-white hover:!text-[#facc15] transition-colors truncate"
            >
              {CONTACT_INFO.email}
            </a>
            <a
              href={mailtoHref}
              className="px-3.5 py-1.5 !bg-white/10 !text-white hover:!bg-white hover:!text-black border border-white/20 text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 [clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)]"
            >
              Send Email ↗
            </a>
          </div>
        </div>

        {/* Discord Server */}
        <div className="bg-[#0e0e11] border border-white/20 border-t-2 border-t-[#facc15] p-5 sm:p-6 flex flex-col justify-between gap-4 [clip-path:polygon(10px_0,100%_0,100%_calc(100%-10px),calc(100%-10px)_100%,0_100%,0_10px)]">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium uppercase tracking-wider text-white/55">
              Official Community
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#facc15] shrink-0">
              Discord Server
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <strong className="text-lg sm:text-xl font-semibold text-white truncate">
              {CONTACT_INFO.discordServerName}
            </strong>
            <a
              href={CONTACT_INFO.discordServerInvite}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#000000" }}
              className="px-4 py-2 !bg-[#facc15] !text-black hover:!bg-[#fde047] font-bold uppercase tracking-wider text-xs shrink-0 transition-colors [clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)]"
            >
              Join Server ↗
            </a>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: Lordboosting FAQ */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 border-b border-white/15 pb-3">
          <span
            style={displayFont}
            className="bg-white text-black text-xs font-bold uppercase tracking-[0.18em] px-2.5 py-0.5 [clip-path:polygon(4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%,0_4px)]"
          >
            FAQ
          </span>
          <h2
            style={displayFont}
            className="text-2xl font-bold uppercase tracking-wider text-white"
          >
            Lordboosting Questions
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={faq.question}
                className="bg-[#0e0e11] border border-white/15 hover:border-white/30 transition-colors [clip-path:polygon(10px_0,100%_0,100%_calc(100%-10px),calc(100%-10px)_100%,0_100%,0_10px)]"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="w-full px-5 py-4 text-left !flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-base sm:text-[17px] font-medium text-white leading-snug">
                    {faq.question}
                  </span>
                  <span className="text-white/60 text-base font-medium shrink-0">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-2 text-sm sm:text-[15px] text-white/75 leading-relaxed border-t border-white/10">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

