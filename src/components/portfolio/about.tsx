"use client";

import { Quote } from "lucide-react";
import { PROFILE } from "@/lib/bio-data";
import { Reveal, SectionHeading } from "./reveal";

export function About() {
  return (
    <section id="about" className="relative py-24 md:py-32 overflow-hidden" aria-label="Executive profile">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -left-40 w-[26rem] h-[26rem] rounded-full bg-[#c9a24b]/[0.05] blur-[110px]"
      />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Leadership Philosophy"
          title={
            <>
              Developing People to <span className="text-gold-gradient italic">Drive Performance</span>
            </>
          }
          description="Systems matter, but people build the business. Transforming frontline teams into self-driven, motivated powerhouses."
        />

        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 lg:gap-14 items-start">
          {/* Bio */}
          <div className="space-y-6">
            {PROFILE.intro.map((para, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <p className="text-base md:text-lg text-[#d8d0bd] leading-[1.9]">{para}</p>
              </Reveal>
            ))}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
              {PROFILE.stats.map((stat, i) => (
                <Reveal key={stat.label} delay={i * 0.08}>
                  <div className="group rounded-2xl border border-border bg-[#121009]/70 p-5 hover:border-[#c9a24b]/45 transition-colors h-full">
                    <p className="font-display text-3xl md:text-4xl font-bold text-gold-gradient">{stat.value}</p>
                    <p className="mt-1.5 text-sm font-bold text-foreground">{stat.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{stat.detail}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Brand statement quote card */}
          <Reveal delay={0.15} className="lg:sticky lg:top-28">
            <figure className="relative rounded-[1.75rem] border border-[#c9a24b]/30 bg-gradient-to-b from-[#16130c] to-[#100d08] p-8 md:p-10 overflow-hidden">
              <div
                aria-hidden="true"
                className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#c9a24b]/10 blur-3xl"
              />
              <Quote className="w-9 h-9 text-[#c9a24b]" aria-hidden="true" />
              <blockquote className="mt-6 font-display text-xl md:text-[1.45rem] leading-[1.6] text-[#efe8d6] italic">
                {PROFILE.brandStatement.replace(/"/g, "")}
              </blockquote>
              <figcaption className="mt-7 pt-6 border-t border-border/70 flex items-center gap-4">
                <span className="w-12 h-12 rounded-full border border-[#c9a24b]/50 bg-[#c9a24b]/10 flex items-center justify-center font-display font-bold text-gold-gradient">
                  IM
                </span>
                <div>
                  <p className="font-semibold text-foreground">Imran Malik</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{PROFILE.headlinePlain}</p>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
