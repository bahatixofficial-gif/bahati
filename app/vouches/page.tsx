import type { Metadata } from "next";
import { Barlow_Condensed, Rajdhani } from "next/font/google";
import { Suspense } from "react";
import SiteHeader from "../components/SiteHeader";
import { getAdminSession } from "../lib/admin-session";
import { getVouches } from "../lib/vouches";
import VouchesBoard from "./VouchesBoard";

const barlowCondensed = Barlow_Condensed({
  weight: ["600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-comic-display",
});

const rajdhani = Rajdhani({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-comic-body",
});

export const metadata: Metadata = {
  title: "Vouches | BAHATI",
};

async function VouchesContent() {
  const [vouches, session] = await Promise.all([
    getVouches(),
    getAdminSession(),
  ]);

  return <VouchesBoard initialVouches={vouches} isAdmin={Boolean(session)} />;
}

export default function VouchesPage() {
  return (
    <main
      className={`site-shell ${barlowCondensed.variable} ${rajdhani.variable}`}
    >
      <SiteHeader />
      <section className="inner-page" aria-labelledby="vouches-title">
        <div className="page-heading">
          <span className="page-eyebrow">Completed orders</span>
          <h1
            id="vouches-title"
            style={{ fontFamily: "var(--font-comic-display), sans-serif" }}
            className="uppercase tracking-wider font-extrabold"
          >
            Vouches
          </h1>
        </div>

        <Suspense fallback={<div className="min-h-[200px]" />}>
          <VouchesContent />
        </Suspense>
      </section>
    </main>
  );
}
