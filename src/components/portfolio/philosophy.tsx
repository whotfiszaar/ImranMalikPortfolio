"use client";

import { Heart, Users, Settings, TrendingUp } from "lucide-react";
import { PHILOSOPHY } from "@/lib/bio-data";
import { Reveal, SectionHeading } from "./reveal";

const ICONS: Record<string, typeof Heart> = {
  heart: Heart,
  users: Users,
  settings: Settings,
  trending: TrendingUp,
};

const NUMERALS = ["01", "02", "03", "04"];

export function Philosophy() {
  return (
    <section id="philosophy" className="relative py-24 md:py-32 overflow-hidden" aria-label="Leadership philosophy">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 -right-40 w-[26rem] h-[26rem] rounded-full bg-[#c9a24b]/[0.05] blur-[110px]"
      />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Leadership Philosophy"
          title={
            <>
              Four Beliefs He <span className="text-gold-gradient italic">Leads By</span>
            </>
          }
          description="Principles that stayed constant whether the store was an airport boutique or a flagship beauty destination."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {PHILOSOPHY.map((item, i) => {
            const Icon = ICONS[item.icon] ?? Heart;
            return (
              <Reveal key={item.title} delay={i * 0.1}>
                <article className="group relative h-full rounded-[1.5rem] border border-border bg-[#121009]/70 p-7 overflow-hidden transition-all duration-500 hover:border-[#c9a24b]/50 hover:-translate-y-1.5">
                  <span
                    aria-hidden="true"
                    className="absolute -top-3 right-4 font-display text-[5rem] font-bold text-[#c9a24b]/[0.13] leading-none select-none group-hover:text-[#c9a24b]/20 transition-colors duration-500"
                  >
                    {NUMERALS[i]}
                  </span>
                  <span className="relative inline-flex w-13 h-13 rounded-2xl border border-[#c9a24b]/40 bg-[#c9a24b]/10 items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Icon className="w-6 h-6 text-[#c9a24b]" aria-hidden="true" />
                  </span>
                  <h3 className="relative mt-5 font-display text-xl font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="relative mt-3 text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                  <div className="mt-6 h-px w-0 bg-gradient-to-r from-[#c9a24b] to-transparent group-hover:w-full transition-all duration-700" aria-hidden="true" />
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
