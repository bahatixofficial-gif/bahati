import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import SiteHeader from "../components/SiteHeader";
import ContactsBoard from "./ContactsBoard";

const barlowCondensed = Barlow_Condensed({
  weight: ["600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-display",
});

const inter = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Contacts | BAHATI",
};

export default function ContactsPage() {
  return (
    <main
      className={`site-shell ${barlowCondensed.variable} ${inter.variable}`}
    >
      <SiteHeader />
      <section className="inner-page" aria-labelledby="contacts-title">
        <div className="page-heading">
          <span className="page-eyebrow">Get in touch</span>
          <h1
            id="contacts-title"
            style={{ fontFamily: "var(--font-display), sans-serif" }}
            className="uppercase tracking-wider font-extrabold"
          >
            Contacts
          </h1>
        </div>

        <ContactsBoard />
      </section>
    </main>
  );
}
