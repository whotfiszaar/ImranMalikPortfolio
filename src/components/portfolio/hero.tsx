"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, Mail, Phone, MapPin, Sparkles } from "lucide-react";
import { PROFILE, SOCIALS } from "@/lib/bio-data";
import { LQIP } from "@/lib/lqip";
import { LinkedInIcon, WhatsAppIcon, XIcon } from "./social-icons";

const SOCIAL_ICONS = [LinkedInIcon, WhatsAppIcon, XIcon];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section id="top" className="relative min-h-svh flex items-center overflow-hidden" aria-label="Introduction">
      {/* Ambient gold glows */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-40 w-[34rem] h-[34rem] rounded-full bg-[#c9a24b]/[0.07] blur-[130px]" />
        <div className="absolute bottom-0 -left-52 w-[30rem] h-[30rem] rounded-full bg-[#9a7a2e]/[0.08] blur-[120px]" />
        {/* faint vertical hairlines */}
        <div className="absolute inset-y-0 left-1/2 w-px bg-[#c9a24b]/[0.07] hidden xl:block" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 md:px-8 pt-32 pb-20 md:pt-36 md:pb-24 w-full">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-14 lg:gap-10 items-center">
          {/* Text column */}
          <motion.div initial={reduce ? false : "hidden"} animate="show">
            <motion.p
              variants={fadeUp}
              custom={0}
              className="eyebrow mb-5 flex items-center gap-3"
            >
              <span className="inline-block w-8 h-px bg-[#c9a24b]/70" aria-hidden="true" />
              Retail Leader. Beauty & Luxury. Mumbai.
            </motion.p>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="font-display font-bold leading-[0.98] text-[clamp(3.2rem,9vw,6.4rem)] tracking-tight"
            >
              Imran
              <br />
              <span className="text-gold-gradient italic font-semibold">Malik</span>
            </motion.h1>

            <motion.div variants={fadeUp} custom={2} className="mt-6">
              <p className="text-lg md:text-2xl font-display font-medium text-[#e8e0cd]">
                {PROFILE.headlinePlain}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {PROFILE.specialties.map((s) => (
                  <span
                    key={s}
                    className="px-3.5 py-1.5 rounded-full border border-[#c9a24b]/30 bg-[#c9a24b]/[0.06] text-gold-light text-xs md:text-sm font-semibold tracking-wide"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.p
              variants={fadeUp}
              custom={3}
              className="mt-7 max-w-xl text-muted-foreground text-base md:text-lg leading-relaxed"
            >
              Ten years and more turning stores into thriving businesses, teams into leaders, and
              customers into loyal fans across India&apos;s finest beauty and lifestyle brands.
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={4}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <a
                href="#journey"
                className="gold-sweep group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#e6cd8a] via-[#c9a24b] to-[#a8862f] text-[#16120a] text-sm md:text-base font-bold tracking-wide shadow-[0_12px_40px_-10px_rgba(201,162,75,0.5)] hover:shadow-[0_16px_52px_-10px_rgba(201,162,75,0.65)] transition-all"
              >
                Explore My Journey
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" aria-hidden="true" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full border border-[#c9a24b]/40 text-gold-light text-sm md:text-base font-bold tracking-wide hover:bg-[#c9a24b]/10 hover:border-[#c9a24b]/70 transition-colors"
              >
                Let&apos;s Talk
              </a>
            </motion.div>

            <motion.div
              variants={fadeUp}
              custom={5}
              className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-muted-foreground"
            >
              <a
                href={`mailto:${PROFILE.email}`}
                className="inline-flex items-center gap-2 hover:text-gold-light transition-colors"
              >
                <Mail className="w-4 h-4 text-[#c9a24b]" aria-hidden="true" />
                {PROFILE.email}
              </a>
              <a
                href={`tel:${PROFILE.phoneHref}`}
                className="inline-flex items-center gap-2 hover:text-gold-light transition-colors"
              >
                <Phone className="w-4 h-4 text-[#c9a24b]" aria-hidden="true" />
                {PROFILE.phone}
              </a>
              <span className="inline-flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#c9a24b]" aria-hidden="true" />
                {PROFILE.location}
              </span>
            </motion.div>

            <motion.div variants={fadeUp} custom={6} className="mt-6 flex items-center gap-3">
              <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#c9a24b]/80">
                Follow
              </span>
              <span aria-hidden="true" className="w-8 h-px bg-[#c9a24b]/30" />
              {SOCIALS.map((social, i) => {
                const Icon = SOCIAL_ICONS[i];
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${PROFILE.firstName} on ${social.name}`}
                    title={social.name}
                    className="w-10 h-10 rounded-full border border-[#c9a24b]/30 bg-[#c9a24b]/[0.05] flex items-center justify-center text-muted-foreground hover:text-gold-light hover:border-[#c9a24b]/70 hover:bg-[#c9a24b]/10 transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Portrait column */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 48, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-[400px] lg:max-w-[440px]"
          >
            {/* Corner ornaments */}
            <div aria-hidden="true" className="absolute -top-4 -left-4 w-24 h-24 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-[#c9a24b] to-transparent" />
              <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-[#c9a24b] to-transparent" />
            </div>
            <div aria-hidden="true" className="absolute -bottom-4 -right-4 w-24 h-24 pointer-events-none">
              <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-[#c9a24b] to-transparent" />
              <div className="absolute bottom-0 right-0 w-px h-full bg-gradient-to-t from-[#c9a24b] to-transparent" />
            </div>

            <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden frame-glow">
              <Image
                src="/images/hero.jpg"
                alt="Imran Malik, Retail Operations and Business Management Leader"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 440px"
                placeholder="blur"
                blurDataURL={LQIP["hero.jpg"]}
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#0a0908]/55 via-transparent to-[#0a0908]/10"
              />
              {/* Name plate */}
              <div className="absolute bottom-5 inset-x-5 flex items-center justify-between rounded-2xl border border-[#c9a24b]/25 bg-[#0a0908]/70 backdrop-blur-md px-5 py-3.5">
                <div>
                  <p className="font-display font-bold text-lg leading-tight text-foreground">Imran Malik</p>
                  <p className="text-xs text-gold-light/90 font-semibold tracking-wide mt-0.5">Retail Sales & Operations Leader</p>
                </div>
                <Sparkles className="w-5 h-5 text-[#c9a24b]" aria-hidden="true" />
              </div>
            </div>

            {/* Floating badge: years */}
            <motion.div
              initial={reduce ? false : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -right-5 md:-right-9 top-10 rounded-2xl border border-[#c9a24b]/35 bg-[#121009]/90 backdrop-blur-md px-4 py-3 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.8)]"
            >
              <p className="font-display text-2xl font-bold text-gold-gradient leading-none">10+</p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mt-1 font-semibold">
                Years Leading
              </p>
            </motion.div>

            {/* Floating badge: brands (left edge, vertically centered so it
                never covers the name plate or the portrait face) */}
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -left-5 md:-left-9 top-1/2 -translate-y-1/2 rounded-2xl border border-[#c9a24b]/35 bg-[#121009]/90 backdrop-blur-md px-4 py-3 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.8)]"
            >
              <p className="font-display text-2xl font-bold text-gold-gradient leading-none">4</p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mt-1 font-semibold">
                Top Brands
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.a
          href="#about"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground hover:text-gold-light transition-colors"
          aria-label="Scroll to About section"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase font-semibold">Scroll</span>
          <motion.span
            animate={reduce ? {} : { y: [0, 7, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          >
            <ArrowDown className="w-4 h-4" aria-hidden="true" />
          </motion.span>
        </motion.a>
      </div>
    </section>
  );
}
