"use client";

import { Compass, Store, TrendingUp, Rocket, Heart, Users } from "lucide-react";
import { HIGHLIGHTS } from "@/lib/bio-data";
import { Reveal, SectionHeading } from "./reveal";

const ICONS: Record<string, typeof Compass> = {
  compass: Compass,
  store: Store,
  trending: TrendingUp,
  rocket: Rocket,
  heart: Heart,
  users: Users,
};

export function Highlights() {
  return (
    <section id="highlights" className="relative py-24 md:py-32 bg-[#0d0b08]" aria-label="Professional highlights">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Professional Highlights"
          title={
            <>
              What Defines <span className="text-gold-gradient italic">a Decade</span>
            </>
          }
          description="Consistent results across sectors, store formats, and regions, from single stores to national footprints."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {HIGHLIGHTS.map((item, i) => {
            const Icon = ICONS[item.icon] ?? Compass;
            return (
              <Reveal key={item.title} delay={i * 0.07}>
                <article className="group relative h-full rounded-2xl border border-border bg-[#121009]/80 p-7 overflow-hidden transition-all duration-500 hover:border-[#c9a24b]/50 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-20px_rgba(201,162,75,0.28)]">
                  <div
                    aria-hidden="true"
                    className="absolute -top-14 -right-14 w-36 h-36 rounded-full bg-[#c9a24b]/[0.07] blur-2xl transition-opacity duration-500 group-hover:bg-[#c9a24b]/15"
                  />
                  <div className="relative">
                    <span className="inline-flex w-12 h-12 rounded-xl border border-[#c9a24b]/40 bg-[#c9a24b]/10 items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <Icon className="w-5.5 h-5.5 text-[#c9a24b]" aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 font-display text-xl font-semibold text-foreground leading-snug">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm md:text-[0.95rem] text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
