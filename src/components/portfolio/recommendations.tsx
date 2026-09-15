"use client";

import Image from "next/image";
import { Quote, Star } from "lucide-react";
import { TESTIMONIALS } from "@/lib/bio-data";
import { Reveal, SectionHeading } from "./reveal";

export function Recommendations() {
  return (
    <section
      id="recommendations"
      className="relative py-24 md:py-32 overflow-hidden"
      aria-label="Recommendations from colleagues"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -right-44 w-[28rem] h-[28rem] rounded-full bg-[#c9a24b]/[0.05] blur-[120px]"
      />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Recommendations"
          title={
            <>
              Words From <span className="text-gold-gradient italic">the People</span>
            </>
          }
          description="Colleagues, founders, and leaders who worked beside Imran across brands and years."
        />

        <div className="columns-1 md:columns-2 xl:columns-3 gap-5 lg:gap-6 [&>*]:mb-5 lg:[&>*]:mb-6">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={Math.min(i * 0.06, 0.36)} className="break-inside-avoid">
              <figure className="group relative rounded-[1.5rem] border border-border bg-[#121009]/80 p-7 transition-all duration-500 hover:border-[#c9a24b]/45 hover:-translate-y-1">
                <div
                  aria-hidden="true"
                  className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[#c9a24b]/[0.06] blur-2xl"
                />
                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <Quote className="w-7 h-7 text-[#c9a24b]/80 flex-shrink-0" aria-hidden="true" />
                    <div className="flex gap-0.5" aria-label="Five star recommendation">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-[#c9a24b] text-[#c9a24b]" aria-hidden="true" />
                      ))}
                    </div>
                  </div>

                  <blockquote className="mt-5 text-sm md:text-[0.93rem] text-[#c9c1ab] leading-[1.85]">
                    {t.quote}
                  </blockquote>

                  <figcaption className="mt-6 pt-5 border-t border-border/70 flex items-center gap-4">
                    {t.image ? (
                      <Image
                        src={t.image}
                        alt={`Photo of ${t.name}`}
                        width={96}
                        height={96}
                        sizes="48px"
                        className="flex-shrink-0 w-12 h-12 rounded-full object-cover border border-[#c9a24b]/50"
                      />
                    ) : (
                      <span
                        className="flex-shrink-0 w-12 h-12 rounded-full border border-[#c9a24b]/50 bg-gradient-to-br from-[#c9a24b]/25 to-[#9a7a2e]/15 flex items-center justify-center font-display font-bold text-gold-light"
                        aria-hidden="true"
                      >
                        {t.initials}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground leading-tight">{t.name}</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-snug">{t.title}</p>
                      {t.meta && (
                        <p className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-[#c9a24b]">
                          <span className="w-1 h-1 rotate-45 bg-[#c9a24b]" aria-hidden="true" />
                          {t.meta}
                        </p>
                      )}
                    </div>
                  </figcaption>
                </div>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
