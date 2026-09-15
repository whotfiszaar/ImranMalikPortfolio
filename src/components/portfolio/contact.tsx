"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Copy, Check, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { PROFILE, SOCIALS } from "@/lib/bio-data";
import { Reveal, SectionHeading } from "./reveal";
import { LinkedInIcon, WhatsAppIcon, XIcon } from "./social-icons";

const SOCIAL_ICONS = [LinkedInIcon, WhatsAppIcon, XIcon];

function ContactCard({
  icon: Icon,
  label,
  value,
  href,
  copyValue,
  delay,
  valueClassName = "text-xl md:text-2xl",
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href: string;
  copyValue: string;
  delay: number;
  valueClassName?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(copyValue);
      setCopied(true);
      toast.success(`${label} copied to clipboard`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy, please select the text instead");
    }
  };

  return (
    <Reveal delay={delay}>
      <div className="group relative h-full rounded-[1.5rem] border border-border bg-[#121009]/80 p-7 md:p-8 transition-all duration-500 hover:border-[#c9a24b]/50 hover:-translate-y-1.5 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-[#c9a24b]/[0.07] blur-3xl group-hover:bg-[#c9a24b]/12 transition-colors"
        />
        <div className="relative">
          <span className="inline-flex w-12 h-12 rounded-xl border border-[#c9a24b]/40 bg-[#c9a24b]/10 items-center justify-center group-hover:scale-110 transition-transform duration-500">
            <Icon className="w-5 h-5 text-[#c9a24b]" aria-hidden="true" />
          </span>
          <p className="mt-5 text-[10px] font-bold tracking-[0.24em] uppercase text-[#c9a24b]">{label}</p>
          <a
            href={href}
            className={`mt-2 flex items-baseline gap-2 font-display font-semibold text-foreground hover:text-gold-light transition-colors ${valueClassName}`}
          >
            <span className="break-words">{value}</span>
            <ArrowUpRight className="w-5 h-5 flex-shrink-0 text-[#c9a24b] opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={copy}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-[#0d0b08] px-4 py-2 text-xs font-bold tracking-wide text-muted-foreground hover:border-[#c9a24b]/50 hover:text-gold-light transition-colors"
            aria-label={`Copy ${label}`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#c9a24b]" aria-hidden="true" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" aria-hidden="true" /> Copy
              </>
            )}
          </button>
        </div>
      </div>
    </Reveal>
  );
}

export function Contact() {
  return (
    <section id="contact" className="relative py-24 md:py-32 overflow-hidden" aria-label="Contact details">
      {/* Ambient glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[46rem] h-[46rem] rounded-full bg-[#c9a24b]/[0.06] blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Get in Touch"
          title={
            <>
              Let&apos;s <span className="text-gold-gradient italic">Talk</span>
            </>
          }
          description="Open to retail leadership roles, store expansion mandates, and conversations about building great retail."
        />

        <div className="grid md:grid-cols-3 gap-5 md:gap-6 max-w-5xl mx-auto">
          <ContactCard
            icon={Mail}
            label="Email"
            value={PROFILE.email}
            href={`mailto:${PROFILE.email}`}
            copyValue={PROFILE.email}
            delay={0}
            valueClassName="text-lg md:text-xl"
          />
          <ContactCard
            icon={Phone}
            label="Phone"
            value={PROFILE.phone}
            href={`tel:${PROFILE.phoneHref}`}
            copyValue={PROFILE.phone}
            delay={0.1}
          />
          <ContactCard
            icon={MapPin}
            label="Location"
            value={PROFILE.location}
            href="https://www.google.com/maps?q=Mumbai,India"
            copyValue={PROFILE.location}
            delay={0.2}
          />
        </div>

        {/* Social links */}
        <Reveal delay={0.22}>
          <div className="mt-5 md:mt-6 flex flex-wrap items-center justify-center gap-3 md:gap-4 max-w-3xl mx-auto">
            {SOCIALS.map((social, i) => {
              const Icon = SOCIAL_ICONS[i];
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 rounded-full border border-border bg-[#121009]/80 px-6 py-3.5 text-sm font-bold tracking-wide text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a24b]/60 hover:text-gold-light hover:shadow-[0_16px_40px_-16px_rgba(201,162,75,0.4)]"
                  aria-label={`Connect with Imran Malik on ${social.name}`}
                >
                  <span className="inline-flex w-9 h-9 rounded-full border border-[#c9a24b]/35 bg-[#c9a24b]/10 items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-4 h-4 text-[#c9a24b]" />
                  </span>
                  <span className="flex items-center gap-1.5">
                    {social.name}
                    <ArrowUpRight className="w-4 h-4 text-[#c9a24b] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" aria-hidden="true" />
                  </span>
                </a>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <motion.a
            href={`mailto:${PROFILE.email}`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="gold-sweep mt-12 flex max-w-xl mx-auto items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#e6cd8a] via-[#c9a24b] to-[#a8862f] px-9 py-5 text-base md:text-lg font-bold tracking-wide text-[#16120a] shadow-[0_20px_60px_-16px_rgba(201,162,75,0.55)]"
          >
            <Mail className="w-5 h-5" aria-hidden="true" />
            Start the Conversation
          </motion.a>
        </Reveal>
      </div>
    </section>
  );
}
