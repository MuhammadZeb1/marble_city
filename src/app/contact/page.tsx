"use client";

import { useState, type FormEvent } from "react";

export default function ContactPage() {
  const [submittedName, setSubmittedName] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");
    setSubmittedName(typeof name === "string" ? name.trim() : "");
    event.currentTarget.reset();
  }

  return (
    <main>
      <section className="contact-layout section-wrap">
        <div className="contact-intro">
          <p className="eyebrow">LET’S TALK STONE</p>
          <h1>Tell us what<br />you’re dreaming of.</h1>
          <p className="intro-copy">
            Choosing stone is personal. Share a little about your project and
            we’ll help you find a piece that feels right.
          </p>
          <div className="contact-note">
            <span className="contact-note-mark" aria-hidden="true">✳</span>
            <p>From a first question to a finished space, we’re here to help.</p>
          </div>
        </div>

        <div className="contact-form-wrap">
          {submittedName && (
            <p className="form-success" role="status">
              Thanks, {submittedName}. Your inquiry has been noted. This demo
              form does not send messages to a server.
            </p>
          )}
          <form className="contact-form" onSubmit={handleSubmit}>
            <label>
              Your name
              <input autoComplete="name" name="name" required />
            </label>
            <label>
              Email address
              <input
                autoComplete="email"
                name="email"
                required
                type="email"
              />
            </label>
            <label>
              A little about your project
              <textarea name="message" required rows={5} />
            </label>
            <button className="button button-dark" type="submit">
              Send your enquiry <span aria-hidden="true">↗</span>
            </button>
            <p className="form-disclaimer">
              Your details stay in this browser demo and aren’t sent anywhere.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
