"use client";

import { useState, useRef } from "react";
import { ArrowUpRight, CalendarPlus, Mail, MessageSquare } from "lucide-react";
import emailjs from "@emailjs/browser";
import Reveal from "./Reveal";
import SocialLinks from "./SocialLinks";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { resolveContactIcon } from "@/lib/section-rendering";

const defaultContactSection = {
  eyebrow: "Let's Work Together",
  heading: "Let's turn your idea into something real.",
  description:
    "Tell me a little about what you're building — scope, timeline, or just the rough shape of it — and I'll reply within 24 hours with clear next steps.",
  info: [
    {
      icon: "Mail",
      label: "Email",
      value: "parvejshahlabib007@gmail.com",
      href: "mailto:parvejshahlabib007@gmail.com",
    },
    { icon: "MapPin", label: "Location", value: "Dhaka, Bangladesh", href: null },
    { icon: "Clock", label: "Response time", value: "Within 24 hours", href: null },
  ],
};

const defaultMeetingSection = {
  eyebrow: "Set a Meeting",
  heading: "Want to talk it through live?",
  description:
    "Propose a date and time that works for you and I'll confirm by email. Once confirmed, you can add it straight to your Google Calendar.",
  durationLabel: "30 min call",
  notes: [
    "I'm based in Dhaka, Bangladesh (GMT+6) — mention your timezone if different.",
    "I'll reply within 8 hours to confirm or suggest another time.",
  ],
};

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

function ContactForm({ content }) {
  const form = useRef();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
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
      setStatus({ type: "error", message: "Message must be at least 10 characters long." });
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
      message: formData.message,
      time: new Date().toLocaleString(),
    };

    emailjs
      .send("service_rfz5bb9", "template_o9ck4y9", templateParams, "8LIpWTqX7mHlzgWsK")
      .then(
        () => {
          setStatus({ type: "success", message: "Message sent! I'll get back to you soon." });
          setFormData({ name: "", email: "", message: "" });
          setIsLoading(false);
        },
        (error) => {
          setStatus({ type: "error", message: "Failed to send message. Please try again." });
          console.log("FAILED...", error?.text);
          setIsLoading(false);
        }
      );
  };

  return (
    <>
      <div className="relative flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
        <h3 className="text-xl font-semibold text-white">Send a message</h3>
        <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-brand" />
          </span>
          Available for work
        </span>
      </div>

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

      <form ref={form} onSubmit={sendEmail} className="relative mt-6 flex flex-1 flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            type="text"
            name="name"
            placeholder="Your name"
            value={formData.name}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            className="h-12 rounded-xl bg-ink-2 px-4 transition-colors focus-visible:border-brand/50 focus-visible:ring-brand/20"
          />
          <Input
            type="email"
            name="email"
            placeholder="Your email"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            className="h-12 rounded-xl bg-ink-2 px-4 transition-colors focus-visible:border-brand/50 focus-visible:ring-brand/20"
          />
        </div>
        <Textarea
          name="message"
          placeholder="Tell me about your project..."
          value={formData.message}
          onChange={handleInputChange}
          required
          disabled={isLoading}
          rows={6}
          className="min-h-36 flex-1 rounded-xl bg-ink-2 px-4 py-3 transition-colors focus-visible:border-brand/50 focus-visible:ring-brand/20"
        />
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
              Send Message
              <ArrowUpRight className="transition-transform duration-300 group-hover/send:-translate-y-0.5 group-hover/send:translate-x-0.5" />
            </>
          )}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Direct, human replies — no newsletters, no spam, ever.
        </p>
      </form>
    </>
  );
}

function MeetingForm({ content }) {
  const form = useRef();
  const [formData, setFormData] = useState({ name: "", email: "", date: "", time: "", topic: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [calendarUrl, setCalendarUrl] = useState(null);

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
    };

    emailjs
      .send("service_rfz5bb9", "template_ccukf65", templateParams, "8LIpWTqX7mHlzgWsK")
      .then(
        () => {
          setStatus({
            type: "success",
            message: "Request sent! I'll confirm by email shortly.",
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
      <h3 className="relative text-xl font-semibold text-white">Propose a time</h3>

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

      {calendarUrl && (
        <a
          href={calendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group/cal mt-3 inline-flex w-fit items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-2 text-xs font-medium text-brand transition-colors hover:bg-brand/20"
        >
          <CalendarPlus className="size-4" />
          Add to Google Calendar
          <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover/cal:-translate-y-0.5 group-hover/cal:translate-x-0.5" />
        </a>
      )}

      <form ref={form} onSubmit={sendRequest} className="relative mt-6 flex flex-1 flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            type="text"
            name="name"
            placeholder="Your name"
            value={formData.name}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            className="h-12 rounded-xl bg-ink-2 px-4 transition-colors focus-visible:border-brand/50 focus-visible:ring-brand/20"
          />
          <Input
            type="email"
            name="email"
            placeholder="Your email"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            className="h-12 rounded-xl bg-ink-2 px-4 transition-colors focus-visible:border-brand/50 focus-visible:ring-brand/20"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            className="h-12 rounded-xl bg-ink-2 px-4 transition-colors focus-visible:border-brand/50 focus-visible:ring-brand/20"
          />
          <Input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            className="h-12 rounded-xl bg-ink-2 px-4 transition-colors focus-visible:border-brand/50 focus-visible:ring-brand/20"
          />
        </div>
        <Textarea
          name="topic"
          placeholder="What would you like to discuss?"
          value={formData.topic}
          onChange={handleInputChange}
          disabled={isLoading}
          rows={4}
          className="min-h-28 flex-1 rounded-xl bg-ink-2 px-4 py-3 transition-colors focus-visible:border-brand/50 focus-visible:ring-brand/20"
        />
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
  const contact = { ...defaultContactSection, ...section };
  const meeting = { ...defaultMeetingSection, ...meetingSection };
  const content = activeTab === "message" ? contact : meeting;

  return (
    <section id="contact" className="border-b border-line py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left: info */}
          <Reveal>
            <span className="eyebrow mb-5">{content.eyebrow}</span>
            <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              {content.heading}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              {content.description}
            </p>

            {activeTab === "message" ? (
              <div className="mt-8 space-y-4">
                {contact.info.map(({ icon, label, value, href }) => {
                  const Icon = resolveContactIcon(icon);
                  const Wrapper = href ? "a" : "div";
                  return (
                    <Wrapper
                      key={label}
                      {...(href ? { href } : {})}
                      className="group flex items-center gap-4 rounded-2xl border border-line bg-ink-2 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:bg-ink-3"
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand/15 text-brand transition-all duration-300 group-hover:scale-105 group-hover:bg-brand/25">
                        <Icon className="size-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
                        <p className="break-all font-medium text-white transition-colors duration-300 group-hover:text-brand sm:break-normal sm:truncate">
                          {value}
                        </p>
                      </div>
                    </Wrapper>
                  );
                })}
              </div>
            ) : (
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-4 rounded-2xl border border-line bg-ink-2 p-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand/15 text-brand">
                    <CalendarPlus className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Duration</p>
                    <p className="font-medium text-white">{meeting.durationLabel}</p>
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
            className="card-surface reveal-scale relative flex flex-col overflow-hidden p-7 sm:p-8"
          >
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-brand/10 blur-3xl"
              aria-hidden
            />

            <div className="relative inline-flex rounded-full border border-line bg-ink-2 p-1">
              <button
                type="button"
                onClick={() => setActiveTab("message")}
                className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "message"
                    ? "bg-brand text-[#05140b]"
                    : "text-muted-foreground hover:text-white"
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
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                <CalendarPlus className="size-4" />
                Meeting
              </button>
            </div>

            <div className="relative mt-6 flex flex-1 flex-col">
              {activeTab === "message" ? (
                <ContactForm content={contact} />
              ) : (
                <MeetingForm content={meeting} />
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
