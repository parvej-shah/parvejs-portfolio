"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUpRight, CalendarPlus, Mail, MessageSquare, CheckCircle2 } from "lucide-react";
import emailjs from "@emailjs/browser";
import Reveal from "./Reveal";
import SocialLinks from "./SocialLinks";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { resolveContactIcon } from "@/lib/section-rendering";
import {
  PROJECT_CATEGORIES,
  DEFAULT_CATEGORY_ID,
  SELECT_CATEGORY_EVENT,
  categoryLabelFor,
} from "@/lib/project-categories";

const defaultContactSection = {
  eyebrow: "Start Your Project",
  heading: "Tell us what you're building.",
  description:
    "No polished brief or formal RFP required. Just tell us your idea, what's currently stopping you, and your target launch date. We'll reply within 24 hours with an initial feasibility read, the questions we'd need answered, and a suggested next step.",
  info: [
    {
      icon: "Mail",
      label: "Direct Email",
      value: "parvejshahlabib007@gmail.com",
      href: "mailto:parvejshahlabib007@gmail.com",
    },
    { icon: "Clock", label: "Response Time", value: "Within 24 hours", href: null },
    { icon: "MapPin", label: "Location", value: "Worldwide · Remote", href: null },
  ],
};

const defaultMeetingSection = {
  eyebrow: "Set a Meeting",
  heading: "Want to talk it through live?",
  description:
    "Propose a date and time that works for you and I'll confirm by email. Once confirmed, you can add it straight to your Google Calendar.",
  durationLabel: "30 min call",
  notes: [
    "Available for calls across US, European, and global timezones.",
    "I'll reply within 8 hours to confirm or suggest another time.",
  ],
};

// The visitor's IANA zone, so a proposed slot is never ambiguous. Resolved
// lazily on the client — Intl is unavailable during SSR-safe module init.
function getVisitorTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "your local time";
  } catch {
    return "your local time";
  }
}

// Today in the visitor's own locale, as the `min` for the date input.
function todayIsoDate() {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - offsetMs).toISOString().split("T")[0];
}

function buildGoogleCalendarUrl({ topic, date, time, durationLabel }) {
  if (!date || !time) return null;

  const start = new Date(`${date}T${time}`);
  if (Number.isNaN(start.getTime())) return null;

  const durationMinutes = Number.parseInt(durationLabel, 10) || 30;
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  const toGCalDate = (d) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Meeting: ${topic || "Call with Parvej Shah"}`,
    dates: `${toGCalDate(start)}/${toGCalDate(end)}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function ContactForm({ formData, setFormData, categoryId, setCategoryId }) {
  const form = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateForm = () => {
    if (formData.name.trim().length < 2) {
      setStatus({ type: "error", message: "Name must be at least 2 characters long." });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus({ type: "error", message: "Please enter a valid email address." });
      return false;
    }
    if (formData.message.trim().length < 10) {
      setStatus({ type: "error", message: "Please describe what you are building (at least 10 characters)." });
      return false;
    }
    return true;
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });
    if (!validateForm()) return;
    setIsLoading(true);

    const templateParams = {
      name: formData.name,
      email: formData.email,
      message: `[Category: ${categoryLabelFor(categoryId)}]\n\n${formData.message}`,
      time: new Date().toLocaleString(),
    };

    emailjs
      .send("service_rfz5bb9", "template_o9ck4y9", templateParams, "8LIpWTqX7mHlzgWsK")
      .then(
        () => {
          setStatus({
            type: "success",
            message: "Request received. I'll review it and reply within 24 hours.",
          });
          setFormData({ name: "", email: "", message: "" });
          setIsLoading(false);
        },
        (error) => {
          setStatus({ type: "error", message: "Failed to send message. Please try again or email directly." });
          console.log("FAILED...", error?.text);
          setIsLoading(false);
        }
      );
  };

  return (
    <>
      <div className="relative">
        <h3 className="text-xl font-semibold text-foreground">Tell us about your project</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Free initial feasibility read — no obligation
        </p>
      </div>

      <div role="status" aria-live="polite" aria-atomic="true">
        {status.message && (
          <div
            className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
              status.type === "success"
                ? "border-brand/40 bg-brand/10 text-brand"
                : "border-red-500/40 bg-red-500/10 text-red-400"
            }`}
          >
            {status.message}
          </div>
        )}
      </div>

      <form ref={form} onSubmit={sendEmail} className="relative mt-6 flex flex-1 flex-col gap-4">
        {/* Project category pills — selection is keyed by stable id, so the
            BuyerSegments cards and this form can never drift apart. */}
        <fieldset className="space-y-2">
          <legend className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            What are you trying to build?
          </legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {PROJECT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                aria-pressed={categoryId === cat.id}
                onClick={() => setCategoryId(cat.id)}
                className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all text-center cursor-pointer ${
                  categoryId === cat.id
                    ? "border-brand bg-brand/15 text-brand shadow-[0_0_15px_-3px_rgba(0,230,118,0.25)]"
                    : "border-line bg-ink-2 text-muted-foreground hover:border-line-strong hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="contact-name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Your name
            </label>
            <Input
              id="contact-name"
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Jane Cooper"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className="h-12 rounded-xl bg-ink-2 px-4 transition-colors focus-visible:border-brand/50 focus-visible:ring-brand/20"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="contact-email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Work email
            </label>
            <Input
              id="contact-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="jane@company.com"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className="h-12 rounded-xl bg-ink-2 px-4 transition-colors focus-visible:border-brand/50 focus-visible:ring-brand/20"
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col space-y-2">
          <label htmlFor="contact-message" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            What do you need help with?
          </label>
          <Textarea
            id="contact-message"
            name="message"
            placeholder="A sentence or two is enough to start."
            value={formData.message}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            rows={4}
            className="min-h-28 flex-1 rounded-xl bg-ink-2 px-4 py-3 transition-colors focus-visible:border-brand/50 focus-visible:ring-brand/20"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="group/send h-12 w-full rounded-full bg-brand text-sm font-semibold text-[#05140b] transition-all hover:bg-brand-dark hover:shadow-[0_8px_30px_-6px_rgba(0,230,118,0.5)] disabled:opacity-60 [&_svg]:size-4 cursor-pointer"
        >
          {isLoading ? (
            <span>Sending...</span>
          ) : (
            <>
              Send Project Details
              <ArrowUpRight className="transition-transform duration-300 group-hover/send:-translate-y-0.5 group-hover/send:translate-x-0.5" />
            </>
          )}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Reply within 24 hours · Confidential · No sales pressure
        </p>
      </form>
    </>
  );
}

function MeetingForm({ content, formData, setFormData }) {
  const form = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [calendarUrl, setCalendarUrl] = useState(null);
  const [visitorTimeZone, setVisitorTimeZone] = useState("your local time");
  const minDate = todayIsoDate();

  useEffect(() => setVisitorTimeZone(getVisitorTimeZone()), []);

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateForm = () => {
    if (formData.name.trim().length < 2) {
      setStatus({ type: "error", message: "Name must be at least 2 characters long." });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus({ type: "error", message: "Please enter a valid email address." });
      return false;
    }
    if (!formData.date || !formData.time) {
      setStatus({ type: "error", message: "Please choose a proposed date and time." });
      return false;
    }
    const proposed = new Date(`${formData.date}T${formData.time}`);
    if (Number.isNaN(proposed.getTime()) || proposed.getTime() < Date.now()) {
      setStatus({ type: "error", message: "Please choose a date and time in the future." });
      return false;
    }
    return true;
  };

  const sendRequest = (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });
    setCalendarUrl(null);
    if (!validateForm()) return;
    setIsLoading(true);

    const templateParams = {
      name: formData.name,
      email: formData.email,
      date: formData.date,
      time: formData.time,
      topic: formData.topic,
      duration: content.durationLabel,
      timezone: visitorTimeZone,
    };

    emailjs
      .send("service_rfz5bb9", "template_ccukf65", templateParams, "8LIpWTqX7mHlzgWsK")
      .then(
        () => {
          setStatus({
            type: "success",
            message: `Request sent for ${formData.date} at ${formData.time} (${visitorTimeZone}). This is not confirmed yet — I'll reply by email within 24 hours.`,
          });
          setCalendarUrl(buildGoogleCalendarUrl({ ...formData, durationLabel: content.durationLabel }));
          setFormData({ name: "", email: "", date: "", time: "", topic: "" });
          setIsLoading(false);
        },
        (error) => {
          setStatus({ type: "error", message: "Failed to send request. Please try again." });
          console.log("FAILED...", error?.text);
          setIsLoading(false);
        }
      );
  };

  return (
    <>
      <h3 className="relative text-xl font-semibold text-foreground">Propose a time</h3>

      <div role="status" aria-live="polite" aria-atomic="true">
        {status.message && (
          <div
            className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
              status.type === "success"
                ? "border-brand/40 bg-brand/10 text-brand"
                : "border-red-500/40 bg-red-500/10 text-red-400"
            }`}
          >
            {status.message}
          </div>
        )}
      </div>

      {calendarUrl && (
        <a
          href={calendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group/cal mt-3 inline-flex w-fit items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-2 text-xs font-medium text-brand transition-colors hover:bg-brand/20"
        >
          <CalendarPlus className="size-4" />
          Save a tentative hold to Google Calendar
          <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover/cal:-translate-y-0.5 group-hover/cal:translate-x-0.5" />
        </a>
      )}

      <form ref={form} onSubmit={sendRequest} className="relative mt-6 flex flex-1 flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="meeting-name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Your name
            </label>
            <Input
              id="meeting-name"
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Jane Cooper"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className="h-12 rounded-xl bg-ink-2 px-4 transition-colors focus-visible:border-brand/50 focus-visible:ring-brand/20"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="meeting-email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Your email
            </label>
            <Input
              id="meeting-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="jane@company.com"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className="h-12 rounded-xl bg-ink-2 px-4 transition-colors focus-visible:border-brand/50 focus-visible:ring-brand/20"
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="meeting-date" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Preferred date
              </label>
              <Input
                id="meeting-date"
                type="date"
                name="date"
                min={minDate}
                value={formData.date}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="h-12 rounded-xl bg-ink-2 px-4 transition-colors focus-visible:border-brand/50 focus-visible:ring-brand/20"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="meeting-time" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Preferred time
              </label>
              <Input
                id="meeting-time"
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="h-12 rounded-xl bg-ink-2 px-4 transition-colors focus-visible:border-brand/50 focus-visible:ring-brand/20"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Times are in your timezone ({visitorTimeZone}).
          </p>
        </div>

        <div className="flex flex-1 flex-col space-y-2">
          <label htmlFor="meeting-topic" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            What would you like to discuss?{" "}
            <span className="font-normal normal-case tracking-normal">(optional)</span>
          </label>
          <Textarea
            id="meeting-topic"
            name="topic"
            placeholder="A sentence or two is enough."
            value={formData.topic}
            onChange={handleInputChange}
            disabled={isLoading}
            rows={3}
            className="min-h-24 flex-1 rounded-xl bg-ink-2 px-4 py-3 transition-colors focus-visible:border-brand/50 focus-visible:ring-brand/20"
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="group/send h-12 w-full rounded-full bg-brand text-sm font-semibold text-[#05140b] transition-all hover:bg-brand-dark hover:shadow-[0_8px_30px_-6px_rgba(0,230,118,0.5)] disabled:opacity-60 [&_svg]:size-4"
        >
          {isLoading ? (
            <span className="inline-flex">
              {"Sending".split("").map((c, i) => (
                <span key={i} className="animate-wave" style={{ animationDelay: `${i * 0.1}s` }}>
                  {c}
                </span>
              ))}
              <span className="animate-wave" style={{ animationDelay: "0.8s" }}>.</span>
              <span className="animate-wave" style={{ animationDelay: "0.9s" }}>.</span>
              <span className="animate-wave" style={{ animationDelay: "1s" }}>.</span>
            </span>
          ) : (
            <>
              Request Meeting
              <ArrowUpRight className="transition-transform duration-300 group-hover/send:-translate-y-0.5 group-hover/send:translate-x-0.5" />
            </>
          )}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          This sends a request — the meeting is confirmed once I reply.
        </p>
      </form>
    </>
  );
}

export default function Contact({ section = defaultContactSection, meetingSection = defaultMeetingSection, socialLinks = [] }) {
  const [activeTab, setActiveTab] = useState("message");
  // Both forms' state lives here so switching tabs never discards typed input.
  const [messageData, setMessageData] = useState({ name: "", email: "", message: "" });
  const [meetingData, setMeetingData] = useState({ name: "", email: "", date: "", time: "", topic: "" });
  const [categoryId, setCategoryId] = useState(DEFAULT_CATEGORY_ID);
  const contact = { ...defaultContactSection, ...section };
  const meeting = { ...defaultMeetingSection, ...meetingSection };
  const content = activeTab === "message" ? contact : meeting;

  useEffect(() => {
    const handler = (e) => {
      const id = e.detail?.categoryId;
      if (!id) return;
      setActiveTab("message");
      setCategoryId(id);
    };
    window.addEventListener(SELECT_CATEGORY_EVENT, handler);
    return () => window.removeEventListener(SELECT_CATEGORY_EVENT, handler);
  }, []);

  return (
    <section id="contact" className="border-b border-line py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5">
        {/* On mobile the form comes first (order-1) so tapping the CTA lands on
            the fields, not on another wall of explanation. On lg the original
            two-column layout is restored. */}
        {/* Mobile-only short intro: enough to orient, then straight to the form. */}
        <Reveal className="lg:hidden">
          <span className="eyebrow mb-4">{content.eyebrow}</span>
          <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            {content.heading}
          </h2>
        </Reveal>

        <div className="mt-8 grid gap-12 lg:mt-0 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left: info — below the form on mobile */}
          <Reveal className="order-2 lg:order-1">
            <div className="hidden lg:block">
              <span className="eyebrow mb-5">{content.eyebrow}</span>
              <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                {content.heading}
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base lg:mt-4">
              {content.description}
            </p>

            {activeTab === "message" && (
              <div className="mt-6 rounded-2xl border border-brand/30 bg-brand/10 dark:bg-brand/[0.04] p-5 max-w-md shadow-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-brand">
                  What you get back within 24 hours (Free)
                </p>
                <ul className="mt-3 space-y-2 text-xs sm:text-sm text-foreground/90">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="size-4 shrink-0 text-brand mt-0.5" />
                    <span><strong>Feasibility read:</strong> Whether it&apos;s buildable, and the risks we&apos;d watch</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="size-4 shrink-0 text-brand mt-0.5" />
                    <span><strong>Open questions:</strong> What we&apos;d need answered to scope it properly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="size-4 shrink-0 text-brand mt-0.5" />
                    <span><strong>Rough shape:</strong> Comparable work we&apos;ve done and how long it took</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="size-4 shrink-0 text-brand mt-0.5" />
                    <span><strong>A clear next step:</strong> Usually a short call — no pressure</span>
                  </li>
                </ul>
              </div>
            )}

            {activeTab === "message" ? (
              <div className="mt-8 space-y-4">
                {contact.info.map(({ icon, label, value, href }) => {
                  const Icon = resolveContactIcon(icon);
                  const Wrapper = href ? "a" : "div";
                  return (
                    <Wrapper
                      key={label}
                      {...(href ? { href } : {})}
                      className="group flex items-center gap-4 rounded-2xl border border-line bg-white/90 dark:bg-ink-2 p-4 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:bg-ink-3 hover:shadow-sm"
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand/15 text-brand transition-all duration-300 group-hover:scale-105 group-hover:bg-brand/25">
                        <Icon className="size-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
                        <p className="break-all font-medium text-foreground transition-colors duration-300 group-hover:text-brand sm:break-normal sm:truncate">
                          {value}
                        </p>
                      </div>
                    </Wrapper>
                  );
                })}
              </div>
            ) : (
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-4 rounded-2xl border border-line bg-white/90 dark:bg-ink-2 p-4 shadow-xs">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand/15 text-brand">
                    <CalendarPlus className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Duration</p>
                    <p className="font-medium text-foreground">{meeting.durationLabel}</p>
                  </div>
                </div>

                {meeting.notes.map((note) => (
                  <p key={note} className="text-sm leading-relaxed text-muted-foreground">
                    {note}
                  </p>
                ))}
              </div>
            )}

            <div className="mt-8">
              <SocialLinks links={socialLinks} />
            </div>
          </Reveal>

          {/* Right: tabbed form */}
          <Reveal
            delay={120}
            className="card-surface reveal-scale relative order-1 flex flex-col overflow-hidden p-7 sm:p-8 lg:order-2"
          >
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-brand/10 blur-3xl"
              aria-hidden
            />

            <div className="relative inline-flex rounded-full border border-line bg-white/80 dark:bg-ink-2 p-1 shadow-xs">
              <button
                type="button"
                onClick={() => setActiveTab("message")}
                className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "message"
                    ? "bg-brand text-[#05140b]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <MessageSquare className="size-4" />
                Message
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("meeting")}
                className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "meeting"
                    ? "bg-brand text-[#05140b]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <CalendarPlus className="size-4" />
                Meeting
              </button>
            </div>

            <div className="relative mt-6 flex flex-1 flex-col">
              {activeTab === "message" ? (
                <ContactForm
                  formData={messageData}
                  setFormData={setMessageData}
                  categoryId={categoryId}
                  setCategoryId={setCategoryId}
                />
              ) : (
                <MeetingForm
                  content={meeting}
                  formData={meetingData}
                  setFormData={setMeetingData}
                />
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
