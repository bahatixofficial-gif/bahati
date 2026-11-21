import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import HeroDirectory from "../components/HeroDirectory";

export const metadata: Metadata = {
  title: "Heroes | BAHATI",
};

export default function HeroesPage() {
  return (
    <main className="site-shell">
      <SiteHeader />
      <HeroDirectory />
    </main>
  );
}
