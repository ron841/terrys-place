"use client";

/**
 * Contact form -> Static Forms.
 *
 * Posts to api.staticforms.xyz with the access key + recipient pulled from
 * env. The "honeypot" field traps bots; honest users never fill it.
 *
 * Per CONTENT-INVENTORY: real recipient TBD; placeholder pending@terrys.place
 * via NEXT_PUBLIC_CONTACT_RECIPIENT env. Form posts go to the placeholder
 * inbox until Eli provides the real address.
 */

import { useState, type FormEvent } from "react";
import { forms } from "@/lib/content";

type Status = "idle" | "submitting" | "ok" | "error";

export function ContactForm({ defaultTopic }: { defaultTopic?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const accessKey = process.env.NEXT_PUBLIC_STATIC_FORMS_KEY ?? "";
  const recipient = process.env.NEXT_PUBLIC_CONTACT_RECIPIENT ?? "pending@terrys.place";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot — if filled, silently treat as success.
    if (data.get("honeypot")) {
      setStatus("ok");
      return;
    }

    const payload = {
      accessKey,
      replyTo: data.get("email"),
      subject: `Terry's Place contact — ${data.get("topic") || "General"}`,
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      message: `Topic: ${data.get("topic")}\n\n${data.get("message")}`,
      $recipient: recipient,
    };

    try {
      const res = await fetch(forms.contact.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const json: { success?: boolean; message?: string } = await res
        .json()
        .catch(() => ({}));
      if (res.ok && (json.success ?? true)) {
        setStatus("ok");
        form.reset();
      } else {
        setStatus("error");
        setErrorMsg(json.message || "Something went wrong. Please call us instead.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Couldn't send right now. Please call us instead.");
    }
  }

  if (status === "ok") {
    return (
      <div className="t-card" role="status" aria-live="polite">
        <p className="t-eyebrow">Message sent</p>
        <p className="t-body" style={{ marginTop: "var(--space-3)" }}>
          Thanks — we&rsquo;ll get back to you. For anything urgent, give us a call.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form" noValidate>
      {/* Honeypot, hidden from users + screen readers */}
      <input
        type="text"
        name="honeypot"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
      />

      <div className="contact-form-row">
        <label>
          <span>Name</span>
          <input type="text" name="name" required autoComplete="name" />
        </label>
        <label>
          <span>Email</span>
          <input type="email" name="email" required autoComplete="email" />
        </label>
      </div>

      <div className="contact-form-row">
        <label>
          <span>Phone (optional)</span>
          <input type="tel" name="phone" autoComplete="tel" />
        </label>
        <label>
          <span>Topic</span>
          <select name="topic" defaultValue={defaultTopic || forms.contact.topics[0]}>
            {forms.contact.topics.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="contact-form-message">
        <span>Message</span>
        <textarea name="message" rows={5} required />
      </label>

      <div className="contact-form-actions">
        <button
          type="submit"
          className="t-btn t-btn--primary"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Sending…" : "Send message"}
        </button>
        {status === "error" && (
          <span className="t-body" style={{ color: "var(--red-soft)" }} role="alert">
            {errorMsg}
          </span>
        )}
      </div>
    </form>
  );
}
