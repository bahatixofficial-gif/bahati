import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import Link from "next/link";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contacts | BAHATI",
};

export default function ContactsPage() {
  return (
    <main className="site-shell">
      <SiteHeader />
      <section className="inner-page" aria-labelledby="contacts-title">
        <div className="page-heading">
          <span className="page-eyebrow">Get in touch</span>
          <h1 id="contacts-title">Contacts</h1>
        </div>

        <div className="contact-layout">
          <div className="contact-main">
            <div className="contact-panel">
              <span className="contact-label">Direct support</span>
              <h2>Questions? Send a message.</h2>
              <p>For boosts, custom packages, pricing, or order support.</p>
              <div className="contact-actions">
                <a className="secondary-button" href="mailto:bahatixofficial@gmail.com">
                  Email
                  <span aria-hidden="true">↗</span>
                </a>
                <Link className="secondary-button" href="/order">
                  View orders
                  <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>

            <ContactForm />
          </div>

          <aside className="contact-sidebar">
            <section className="contact-info-card">
              <span className="contact-label">Availability</span>
              <h2>Response hours</h2>
              <p>Typically within 24 hours.</p>
              <p className="support-note">Available across major time zones.</p>
            </section>

            <section className="contact-info-card" id="faq">
              <span className="contact-label">FAQ</span>
              <h2>Common questions</h2>
              <details>
                <summary>How long does a boost take?</summary>
                <p>Timing depends on the hero, service, and current progress. We confirm an estimate before your order starts.</p>
              </details>
              <details>
                <summary>Can I request a custom package?</summary>
                <p>Yes. Send your hero, goals, and preferred schedule through the contact form.</p>
              </details>
              <details>
                <summary>How do I track support?</summary>
                <p>Keep your email or Discord conversation open so we can quickly send updates and answer follow-up questions.</p>
              </details>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
