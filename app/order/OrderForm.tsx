"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { heroes } from "../data/heroes";

export default function OrderForm() {
  const searchParams = useSearchParams();
  const hero = searchParams.get("hero") ?? "";
  return <OrderFormFields key={hero} initialHero={hero} />;
}

function OrderFormFields({ initialHero }: { initialHero: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [selectedHero, setSelectedHero] = useState(initialHero);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "order",
        data: {
          hero: String(form.get("hero") ?? ""),
          service: String(form.get("service") ?? ""),
          email: String(form.get("email") ?? ""),
        },
      }),
    });
    setSubmitted(response.ok);
  }

  return (
    <form className="order-form" onSubmit={handleSubmit}>
      <label>
        Hero
        <select
          name="hero"
          value={selectedHero}
          onChange={(event) => setSelectedHero(event.target.value)}
        >
          <option value="" disabled>Select a hero</option>
          {heroes
            .filter((item) =>
              item.name !== "ADAM WARLOCK" && item.name !== "MANTIS",
            )
            .map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
        </select>
      </label>
      <label>
        Desired service
        <select name="service" defaultValue="">
          <option value="" disabled>Select a service</option>
          <option>Hero proficiency</option>
          <option>Rank progression</option>
          <option>Coaching</option>
        </select>
      </label>
      <label>
        Email
        <input name="email" type="email" placeholder="you@example.com" />
      </label>
      <button className="primary-button" type="submit">
        Submit order
        <span aria-hidden="true">↗</span>
      </button>
      {submitted && <p className="form-status" role="status">Order submitted successfully.</p>}
    </form>
  );
}
