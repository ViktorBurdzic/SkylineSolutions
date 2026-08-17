import { useState, type FormEvent } from "react";
import { SITE, WEB3FORMS_ACCESS_KEY } from "../config/site";

type Status = "idle" | "submitting" | "success" | "error";

const helpOptions = [
  "AI Agents & Automation",
  "Custom Software & Integrations",
  "New CRM / CMS Platform",
  "AI-Powered Modernization",
  "Not sure yet — general inquiry",
];

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [draft, setDraft] = useState("");

  /** Escape hatch when the form service fails: the same message, as an email. */
  function mailtoFallback() {
    const subject = encodeURIComponent("Project inquiry — Skyline Solutions");
    return `mailto:${SITE.email}?subject=${subject}&body=${encodeURIComponent(draft)}`;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    // Kept so a failed post can be handed back to the visitor as an email
    // rather than silently lost.
    setDraft(
      [
        `Name: ${formData.get("name") ?? ""}`,
        `Company: ${formData.get("company") ?? ""}`,
        `Email: ${formData.get("email") ?? ""}`,
        `Needs help with: ${formData.get("help_with") ?? ""}`,
        "",
        String(formData.get("description") ?? ""),
      ].join("\n")
    );

    formData.append("access_key", WEB3FORMS_ACCESS_KEY);
    formData.append("subject", "New project inquiry — Skyline Solutions website");
    formData.append("from_name", "Skyline Solutions Website");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      const result = await response.json();

      if (result.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
        setErrorMessage(result.message || "Something went wrong. Please try again, or email us directly.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again, or email us directly.");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-xl border border-accent-500/40 bg-accent-500/10 p-8 text-center"
      >
        <p className="text-lg font-semibold text-white">Thanks — your message is in.</p>
        <p className="mt-2 text-sm text-text-dim">
          We'll read what you've shared and get back to you shortly.
        </p>
        {/*
          The form service can accept a submission and still fail to deliver it
          (a suppressed address does exactly that, silently). Showing the inbox
          here means a visitor always has a second route that doesn't depend on
          the service working.
        */}
        <p className="mt-4 border-t border-line pt-4 text-sm text-text-dim">
          No reply within a day or two?{" "}
          <a
            href={`mailto:${SITE.email}`}
            className="font-medium text-accent-400 transition-colors duration-200 hover:text-white"
          >
            {SITE.email}
          </a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-white">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className="w-full rounded-md border border-line-strong bg-ink-900 px-4 py-2.5 text-sm text-text placeholder:text-text-faint focus:border-accent-400 focus:outline-none"
            placeholder="Jane Doe"
          />
        </div>
        <div>
          <label htmlFor="company" className="mb-2 block text-sm font-medium text-white">
            Company
          </label>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            className="w-full rounded-md border border-line-strong bg-ink-900 px-4 py-2.5 text-sm text-text placeholder:text-text-faint focus:border-accent-400 focus:outline-none"
            placeholder="Company name"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-white">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-md border border-line-strong bg-ink-900 px-4 py-2.5 text-sm text-text placeholder:text-text-faint focus:border-accent-400 focus:outline-none"
          placeholder="jane@company.com"
        />
      </div>

      <div>
        <label htmlFor="help" className="mb-2 block text-sm font-medium text-white">
          What do you need help with?
        </label>
        <select
          id="help"
          name="help_with"
          required
          defaultValue=""
          className="w-full rounded-md border border-line-strong bg-ink-900 px-4 py-2.5 text-sm text-text focus:border-accent-400 focus:outline-none"
        >
          <option value="" disabled>
            Select an area
          </option>
          {helpOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className="mb-2 block text-sm font-medium text-white">
          Project description <span className="text-text-faint font-normal">(optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          className="w-full resize-y rounded-md border border-line-strong bg-ink-900 px-4 py-2.5 text-sm text-text placeholder:text-text-faint focus:border-accent-400 focus:outline-none"
          placeholder="What does your team currently do manually? What systems are involved?"
        />
      </div>

      {/* Honeypot field — hidden from real users, filters basic bots */}
      <input type="checkbox" name="botcheck" className="hidden" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

      {status === "error" && (
        <div role="alert" className="rounded-md border border-red-400/40 bg-red-400/10 p-4">
          <p className="text-sm text-red-300">{errorMessage}</p>
          {/*
            A failed post used to be a dead end — the visitor's message was gone
            and there was nothing to do about it. This hands them the inbox
            directly, with what they typed carried over.
          */}
          <a
            href={mailtoFallback()}
            className="mt-2 inline-block text-sm font-medium text-white underline underline-offset-4 hover:text-accent-400"
          >
            Send it as an email instead
          </a>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent-500 px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-accent-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
