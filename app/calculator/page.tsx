import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import PriceCalculator from "./PriceCalculator";

export const metadata: Metadata = {
  title: "Pricing | BAHATI",
};

export default function CalculatorPage() {
  return (
    <main className="site-shell">
      <SiteHeader />
      <section className="inner-page" aria-labelledby="calculator-title">
        <div className="page-heading">
          <span className="page-eyebrow">Build your package</span>
          <h1 id="calculator-title">Price Calculator</h1>
        </div>
        <PriceCalculator />
      </section>
    </main>
  );
}
