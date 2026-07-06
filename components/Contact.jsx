"use client";

import { useState, useRef } from "react";
import { Mail, MapPin, Clock, ArrowUpRight } from "lucide-react";
import emailjs from "@emailjs/browser";
import Reveal from "./Reveal";
import SocialLinks from "./SocialLinks";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

const contactInfo = [
  { Icon: Mail, label: "Email", value: "parvejshahlabib007@gmail.com", href: "mailto:parvejshahlabib007@gmail.com" },
  { Icon: MapPin, label: "Location", value: "Dhaka, Bangladesh", href: null },
  { Icon: Clock, label: "Response time", value: "Within 24 hours", href: null },
];

export default function Contact() {
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
    <section id="contact" className="border-b border-line py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left: info */}
          <Reveal>
            <span className="eyebrow mb-5">Let&apos;s Work Together</span>
            <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Let&apos;s turn your idea into something real.
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Tell me a little about what you&apos;re building — scope, timeline,
              or just the rough shape of it — and I&apos;ll reply within 24 hours
              with clear next steps.
            </p>

            <div className="mt-8 space-y-4">
              {contactInfo.map(({ Icon, label, value, href }) => {
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
                      <p className="truncate font-medium text-white transition-colors duration-300 group-hover:text-brand">
                        {value}
                      </p>
                    </div>
                  </Wrapper>
                );
              })}
            </div>

            <div className="mt-8">
              <SocialLinks />
            </div>
          </Reveal>

          {/* Right: form */}
          <Reveal
            delay={120}
            className="card-surface reveal-scale relative flex flex-col overflow-hidden p-7 sm:p-8"
          >
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-brand/10 blur-3xl"
              aria-hidden
            />
            <div className="relative flex items-center justify-between gap-4">
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
          </Reveal>
        </div>
      </div>
    </section>
  );
}
