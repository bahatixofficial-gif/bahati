"use client";

import { FormEvent, useState } from "react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const discord = String(form.get("discord") ?? "");
    const subject = String(form.get("subject") ?? "BAHATI support request");
    const message = String(form.get("message") ?? "");

    const response = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "contact",
        data: { name, discord, subject, message },
      }),
    });
    setSubmitted(response.ok);
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <label>
        Name
        <input name="name" type="text" placeholder="Your name" required />
      </label>
      <label>
        Your Discord username
        <input name="discord" type="text" placeholder="your discord username" />
      </label>
      <label>
        What do you need?
        <select name="subject" defaultValue="General question">
          <option>General question</option>
          <option>Order support</option>
          <option>Custom package</option>
          <option>Pricing</option>
        </select>
      </label>
      <label>
        Message
        <textarea name="message" placeholder="Tell us how we can help..." required />
      </label>
      <button className="primary-button contact-submit" type="submit">
        Send message
        <span aria-hidden="true">↗</span>
      </button>
      {submitted && (
        <p className="form-status" role="status">
          Message submitted successfully.
        </p>
      )}
    </form>
  );
}
