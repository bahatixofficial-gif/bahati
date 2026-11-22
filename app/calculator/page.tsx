import type { Metadata } from "next";
import { Barlow_Condensed, Rajdhani } from "next/font/google";
import { Suspense } from "react";
import SiteHeader from "../components/SiteHeader";
import PriceCalculator from "./PriceCalculator";

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
  title: "Price Calculator | BAHATI",
};

export default function CalculatorPage() {
  return (
    <main
      className={`site-shell ${barlowCondensed.variable} ${rajdhani.variable}`}
    >
      <SiteHeader />
      <section className="inner-page" aria-labelledby="calculator-title">
        <div className="page-heading">
          <span className="page-eyebrow">Build your package</span>
          <h1
            id="calculator-title"
            style={{ fontFamily: "var(--font-comic-display), sans-serif" }}
            className="uppercase tracking-wider font-extrabold"
          >
            Price Calculator
          </h1>
        </div>
        <Suspense fallback={<div className="calculator-layout" />}>
          <PriceCalculator />
        </Suspense>
      </section>
    </main>
  );
}
