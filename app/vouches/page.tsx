import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Vouches | BAHATI",
};

const vouches = [
  {
    name: "Verified Customer",
    service: "Hero Proficiency",
    quote: "Fast communication and the order was completed exactly as discussed.",
  },
  {
    name: "Verified Customer",
    service: "Rank Progression",
    quote: "Clear updates throughout the process and great overall experience.",
  },
  {
    name: "Verified Customer",
    service: "Coaching",
    quote: "Helpful, organized, and easy to communicate with from start to finish.",
  },
];

export default function VouchesPage() {
  return (
    <main className="site-shell">
      <SiteHeader />
      <section className="inner-page" aria-labelledby="vouches-title">
        <div className="page-heading">
          <span className="page-eyebrow">Community feedback</span>
          <h1 id="vouches-title">Vouches</h1>
        </div>

        <div className="vouch-summary">
          <div>
            <strong>5.0</strong>
            <span>Customer rating</span>
          </div>
          <div>
            <strong>Verified</strong>
            <span>BAHATI feedback</span>
          </div>
        </div>

        <div className="vouch-grid">
          {vouches.map((vouch, index) => (
            <article className="vouch-card" key={`${vouch.name}-${index}`}>
              <div className="vouch-stars" aria-label="5 out of 5 stars">
                ★★★★★
              </div>
              <p>“{vouch.quote}”</p>
              <div className="vouch-footer">
                <strong>{vouch.name}</strong>
                <span>{vouch.service}</span>
              </div>
            </article>
          ))}
        </div>

        <Link className="primary-button vouch-order" href="/heroes">
          Browse heroes
          <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </main>
  );
}
