import type { Metadata } from "next";
import { Suspense } from "react";
import SiteHeader from "../components/SiteHeader";
import OrderForm from "./OrderForm";

export const metadata: Metadata = {
  title: "Order | BAHATI",
};

export default function OrderPage() {
  return (
    <main className="site-shell">
      <SiteHeader />
      <section className="inner-page" aria-labelledby="order-title">
        <div className="page-heading">
          <span className="page-eyebrow">Start your boost</span>
          <h1 id="order-title">Order</h1>
        </div>
        <Suspense fallback={<div className="order-form" />}>
          <OrderForm />
        </Suspense>
      </section>
    </main>
  );
}
