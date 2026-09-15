"use client";

import { GraduationCap, BookOpen, Scale, Lightbulb } from "lucide-react";
import { EDUCATION } from "@/lib/bio-data";
import { Reveal, SectionHeading } from "./reveal";

const ICONS: Record<string, typeof GraduationCap> = {
  graduation: GraduationCap,
  book: BookOpen,
  scale: Scale,
  lightbulb: Lightbulb,
};

export function Education() {
  return (
    <section id="education" className="relative py-24 md:py-32 bg-[#0d0b08]" aria-label="Education">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Education"
          title={
            <>
              Grounded in <span className="text-gold-gradient italic">the Classroom</span>
            </>
          }
          description="Formal training in law, marketing, and management that still informs every business decision."
        />

        <div className="grid md:grid-cols-2 gap-5 md:gap-6 max-w-5xl mx-auto">
          {EDUCATION.map((edu, i) => {
            const Icon = ICONS[edu.icon] ?? GraduationCap;
            return (
              <Reveal key={edu.degree} delay={Math.min(i * 0.1, 0.3)}>
                <article className="group h-full rounded-[1.5rem] border border-border bg-[#121009]/80 p-7 md:p-8 transition-all duration-500 hover:border-[#c9a24b]/50 hover:-translate-y-1">
                  <div className="flex items-start gap-5">
                    <span className="flex-shrink-0 w-14 h-14 rounded-2xl border border-[#c9a24b]/40 bg-[#c9a24b]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <Icon className="w-6 h-6 text-[#c9a24b]" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-display text-xl md:text-[1.35rem] font-semibold text-foreground leading-snug">
                        {edu.degree}
                      </h3>
                      <p className="mt-2 text-sm text-gold-light font-semibold leading-relaxed">
                        {edu.institute}
                      </p>
                      <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-border bg-[#0d0b08] px-3.5 py-1 text-xs font-bold tracking-wide text-[#b0a78f]">
                        <span className="w-1.5 h-1.5 rotate-45 bg-[#c9a24b]" aria-hidden="true" />
                        {edu.detail}
                      </p>
                    </div>
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
