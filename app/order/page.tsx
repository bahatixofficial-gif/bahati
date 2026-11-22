import type { Metadata } from "next";
import { Barlow_Condensed, Rajdhani } from "next/font/google";
import { Suspense } from "react";
import SiteHeader from "../components/SiteHeader";
import OrderForm from "./OrderForm";

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
  title: "Order | BAHATI",
};

export default function OrderPage() {
  return (
    <main
      className={`site-shell ${barlowCondensed.variable} ${rajdhani.variable}`}
    >
      <SiteHeader />
      <section className="inner-page" aria-labelledby="order-title">
        <div className="page-heading">
          <span className="page-eyebrow">Start your boost</span>
          <h1
            id="order-title"
            style={{ fontFamily: "var(--font-comic-display), sans-serif" }}
            className="uppercase tracking-wider font-extrabold"
          >
            Order
          </h1>
        </div>
        <Suspense fallback={<div className="order-form" />}>
          <OrderForm />
        </Suspense>
      </section>
    </main>
  );
}
