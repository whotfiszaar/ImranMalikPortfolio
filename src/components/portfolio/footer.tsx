"use client";

import { motion } from "framer-motion";
import { ArrowUp, Sparkles } from "lucide-react";
import { NAV_LINKS, PROFILE, SOCIALS } from "@/lib/bio-data";
import { LinkedInIcon, WhatsAppIcon, XIcon } from "./social-icons";

const SOCIAL_ICONS = [LinkedInIcon, WhatsAppIcon, XIcon];

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-border bg-[#080706]">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-12 md:py-14 pb-[calc(3rem+env(safe-area-inset-bottom))]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex items-center gap-4">
            <span className="w-12 h-12 rounded-xl border border-[#c9a24b]/50 bg-[#14110a] flex items-center justify-center font-display text-xl font-bold text-gold-gradient">
              IM
            </span>
            <div>
              <p className="font-display text-lg font-semibold text-foreground">
                Imran <span className="text-gold-gradient">Malik</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{PROFILE.headlinePlain}</p>
            </div>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-gold-light transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <motion.a
              href="#top"
              whileHover={{ y: -3 }}
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-xs font-bold tracking-wide text-muted-foreground hover:text-gold-light hover:border-[#c9a24b]/50 transition-colors"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" aria-hidden="true" />
              Top
            </motion.a>
          </div>
        </div>

        <div className="gold-hairline mt-10 mb-7" aria-hidden="true" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <p className="text-xs text-muted-foreground text-center sm:text-left">
              {new Date().getFullYear()} Imran Malik. Crafted with care in Mumbai.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-2.5">
              {SOCIALS.map((social, i) => {
                const Icon = SOCIAL_ICONS[i];
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Imran Malik on ${social.name}`}
                    title={social.name}
                    className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-gold-light hover:border-[#c9a24b]/60 transition-colors"
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                );
              })}
            </div>
          </div>
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="w-3.5 h-3.5 text-[#c9a24b]" aria-hidden="true" />
            Retail is a people business. Every detail here proves it.
          </p>
        </div>
      </div>
    </footer>
  );
}
