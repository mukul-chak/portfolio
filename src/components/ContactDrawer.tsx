"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import Drawer from "@/components/ui/Drawer";
import * as Button from "@/components/ui/Button";
import { showSuccessToast } from "@/components/ui/SuccessToast";
import { EMAIL } from "@/content/site";

/** Dispatched by "write to me" links; the drawer opens on it, as on `w`. */
export const OPEN_CONTACT_EVENT = "open-contact";

type Values = { email: string; subject: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;

const EMPTY: Values = { email: "", subject: "", message: "" };

function validate(v: Values): Errors {
  const errors: Errors = {};
  if (!v.email.trim()) errors.email = "Enter your email";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) errors.email = "Enter a valid email";
  if (!v.subject.trim()) errors.subject = "Add a subject";
  if (!v.message.trim()) errors.message = "Write a message";
  return errors;
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className="shrink-0">
      <rect x="2.75" y="6.25" width="8.5" height="6" rx="1.25" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4.75 6.25V4.5a2.25 2.25 0 0 1 4.5 0v1.75" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

// Compose-window rows: label in a fixed column on the left, a borderless
// field on the right, a hairline under each row — the site's own rule
// grammar rather than boxed inputs. 72px fits "Subject" in Monument with
// room, so every field starts on the same x. Each row is a fixed 48px,
// hairline included, with its field stretched to fill — a field sized to
// 48px on its own made those rows a pixel taller than the To row.
const ROW = "flex h-12 items-center gap-3 border-b transition-colors duration-100 ease-out";
const ROW_LABEL = "w-[72px] shrink-0 font-[family-name:var(--font-eyebrow)] text-[14px] text-text-sub-600";
// Borderless, so focus shows on the row's hairline instead (focus-within),
// darkening to bg-surface-800 — one step softer than black, as Mukul asked;
// AlignUI has no stroke tier between soft-200/sub-300 and strong-950, so the
// surface token stands in (it flips to neutral-200 in dark, like a stroke
// would). An invalid row's hairline goes error-base.
//
// What the visitor types is surface-800: a shade darker than the body
// copy's sub-600 so it reads as their input, but not strong-950's full
// black — the same step the title, focus line and Send use.
const FIELD =
  "min-w-0 flex-1 bg-transparent text-[16px] text-bg-surface-800 outline-none placeholder:text-text-soft-400";

function Row({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      // One colour class per state: with border-rule always present beside
      // border-error-base, stylesheet order picked the winner, and the rule
      // won.
      className={`${ROW} ${error ? "border-error-base" : "border-rule focus-within:border-bg-surface-800"}`}
    >
      <label htmlFor={id} className={ROW_LABEL}>
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="shrink-0 text-[14px] text-error-base">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * "Write to me": a drawer with a short email form, opened by the `w` hotkey
 * (the companion to `c`) or a "write to me" link.
 *
 * Front end only for now. Send posts to /api/contact, which doesn't exist
 * yet, so every send fails honestly — the inline error, with the address to
 * email instead — rather than faking a success. When the route lands,
 * nothing here changes.
 *
 * The draft survives closing (Esc, Cancel, the scrim) and is only cleared
 * once a message is sent, so a misclick doesn't cost anyone their message.
 * The `company` field is a honeypot: hidden from people, filled by bots,
 * and checked by the route.
 */
export default function ContactDrawer() {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [honeypot, setHoneypot] = useState("");
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const formId = useId();
  const ids = {
    email: `${formId}-email`,
    subject: `${formId}-subject`,
    message: `${formId}-message`,
  };

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "w" || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = document.activeElement as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
      setOpen(true);
    }
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_CONTACT_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_CONTACT_EVENT, onOpen);
    };
  }, []);

  function update(key: keyof Values, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
    if (status === "error") setStatus("idle");
  }

  async function send() {
    if (status === "sending") return;
    const found = validate(values);
    setErrors(found);
    const firstInvalid = (Object.keys(ids) as (keyof Values)[]).find((k) => found[k]);
    if (firstInvalid) {
      document.getElementById(ids[firstInvalid])?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, company: honeypot }),
      });
      if (!res.ok) throw new Error(String(res.status));
      showSuccessToast("Message sent", `Thanks. I’ll be in touch at ${values.email.trim()}`);
      setValues(EMPTY);
      setStatus("idle");
      setOpen(false);
    } catch {
      setStatus("error");
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send();
  }

  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
  // On touch, focusing the From field on open raises the on-screen keyboard
  // before anyone has asked to type, covering half the drawer. There the
  // drawer's own focus default (its close button) takes it instead, which
  // keeps keyboard and screen-reader users inside the dialog without a
  // keyboard popping up.
  const finePointer = typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
  // The full placeholder is 281px of Reform at 16px; below md the field is
  // 258px at 375 and narrower on smaller phones, so it was cut mid-word.
  // The short one keeps the joke at 171px.
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    setNarrow(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setNarrow(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const invalid = (key: keyof Values) =>
    errors[key] ? { "aria-invalid": true, "aria-describedby": `${ids[key]}-error` } : {};

  return (
    <Drawer
      open={open}
      onClose={() => setOpen(false)}
      title="Write to me"
      initialFocusRef={finePointer ? firstFieldRef : undefined}
      footer={
        <div className="flex items-center justify-between gap-4 pt-3">
          <p className="hidden font-[family-name:var(--font-eyebrow)] text-[14px] text-text-soft-400 md:block">
            Esc to close · {isMac ? "⌘" : "Ctrl"} Enter to send
          </p>
          <div className="ml-auto flex gap-2">
            <Button.Root type="button" variant="neutral" mode="stroke" size="md" onClick={() => setOpen(false)}>
              Cancel
            </Button.Root>
            <Button.Root
              type="submit"
              form={formId}
              variant="neutral"
              mode="filled"
              size="md"
              // One step softer than filled's strong-950, matching the
              // focused row's line.
              className="bg-bg-surface-800"
              aria-busy={status === "sending"}
            >
              {status === "sending" ? "Sending…" : "Send"}
            </Button.Root>
          </div>
        </div>
      }
    >
      <form
        id={formId}
        noValidate
        onSubmit={onSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            void send();
          }
        }}
        className="relative flex min-h-full flex-col"
      >
        <div className={`${ROW} border-rule`}>
          <span className={ROW_LABEL}>To</span>
          <span className="flex items-center gap-1.5 text-[16px] text-text-sub-600">
            <span className="text-text-soft-400">
              <LockIcon />
            </span>
            {EMAIL}
          </span>
        </div>

        <Row id={ids.email} label="From" error={errors.email}>
          <input
            ref={firstFieldRef}
            id={ids.email}
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            className={`${FIELD} self-stretch`}
            {...invalid("email")}
          />
        </Row>

        <Row id={ids.subject} label="Subject" error={errors.subject}>
          <input
            id={ids.subject}
            placeholder={narrow ? "A note about your kerning" : "A strongly worded note about your kerning"}
            value={values.subject}
            onChange={(e) => update("subject", e.target.value)}
            className={`${FIELD} self-stretch`}
            {...invalid("subject")}
          />
        </Row>

        {/* The message fills whatever height is left, down to the footer's
            stroke, as the body of a compose window does. */}
        <label htmlFor={ids.message} className="sr-only">
          Message
        </label>
        <textarea
          id={ids.message}
          placeholder="Hi Mukul,"
          maxLength={5000}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          className={`${FIELD} min-h-[160px] flex-1 resize-none py-4 leading-[1.5]`}
          {...invalid("message")}
        />
        {errors.message && (
          <p id={`${ids.message}-error`} className="pb-3 text-[14px] text-error-base">
            {errors.message}
          </p>
        )}

        {/* Honeypot: off-screen, out of the tab order, ignored by assistive
            tech. People never fill it; bots usually do. */}
        <input
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="pointer-events-none absolute -left-[9999px] h-px w-px opacity-0"
        />

        {status === "error" && (
          <p role="alert" className="pb-3 text-[14px] text-error-base">
            Your message couldn’t be sent. Email me at{" "}
            <a href={`mailto:${EMAIL}`} className="underline underline-offset-[3px]">
              {EMAIL}
            </a>{" "}
            instead.
          </p>
        )}
      </form>
    </Drawer>
  );
}
