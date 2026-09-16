"use client";

import { motion } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";
import { CAREER } from "@/lib/bio-data";
import { Reveal, SectionHeading } from "./reveal";

export function Journey() {
  return (
    <section id="journey" className="relative py-24 md:py-32 bg-[#0d0b08] overflow-hidden" aria-label="Career journey">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 -left-40 w-[26rem] h-[26rem] rounded-full bg-[#c9a24b]/[0.05] blur-[110px]"
      />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Career Journey"
          title={
            <>
              From Shop Floor to <span className="text-gold-gradient italic">Operations Leader</span>
            </>
          }
          description="Eight roles across a decade and more, each one a bigger stage, from Mumbai Airport Terminal 2 to India's fastest-growing beauty retail destination."
        />

        <div className="relative">
          {/* Timeline spine */}
          <div
            aria-hidden="true"
            className="absolute left-[19px] md:left-1/2 md:-translate-x-px top-2 bottom-8 w-px bg-gradient-to-b from-[#c9a24b]/70 via-[#c9a24b]/25 to-transparent"
          />

          <ol className="space-y-10 md:space-y-14">
            {CAREER.map((job, i) => {
              const isRight = i % 2 === 1;
              return (
                <li key={job.id} className="relative">
                  {/* Timeline node */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className={`absolute z-10 left-[19px] md:left-1/2 -translate-x-1/2 top-8 w-[38px] h-[38px] rounded-full border-2 ${
                      job.current
                        ? "border-[#c9a24b] bg-[#c9a24b]/15 shadow-[0_0_24px_rgba(201,162,75,0.4)]"
                        : "border-[#c9a24b]/50 bg-[#121009]"
                    } flex items-center justify-center font-display font-bold text-sm text-gold-gradient`}
                    aria-hidden="true"
                  >
                    {job.companyBadge}
                    {job.current && (
                      <span className="absolute inset-0 rounded-full border border-[#c9a24b]/50 chat-pulse-ring" aria-hidden="true" />
                    )}
                  </motion.div>

                  <div
                    className={`pl-14 md:pl-0 md:w-[calc(50%-44px)] ${
                      isRight ? "md:ml-auto" : ""
                    }`}
                  >
                    <Reveal>
                      <article
                        className={`group relative rounded-[1.5rem] border p-6 md:p-8 transition-all duration-500 hover:-translate-y-1 ${
                          job.current
                            ? "border-[#c9a24b]/60 bg-gradient-to-b from-[#1a150b] to-[#121009] shadow-[0_24px_70px_-24px_rgba(201,162,75,0.3)]"
                            : "border-border bg-[#121009]/80 hover:border-[#c9a24b]/40 hover:shadow-[0_24px_60px_-28px_rgba(0,0,0,0.9)]"
                        }`}
                      >
                        {job.current && (
                          <span className="absolute -top-3 right-6 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#e6cd8a] to-[#c9a24b] text-[#16120a] text-[10px] font-bold tracking-[0.14em] uppercase px-3.5 py-1">
                            <Sparkles className="w-3 h-3" aria-hidden="true" />
                            Current Role
                          </span>
                        )}

                        <p className="text-xs font-bold tracking-[0.16em] uppercase text-[#c9a24b]">
                          {job.period}
                        </p>
                        <h3 className="mt-2.5 font-display text-2xl md:text-[1.7rem] font-semibold text-foreground leading-snug">
                          {job.role}
                        </h3>
                        {job.heading && (
                          <p className="mt-1.5 inline-flex items-center gap-2 rounded-full border border-[#c9a24b]/40 bg-[#c9a24b]/10 px-3.5 py-1 text-xs md:text-[0.8rem] font-bold tracking-wide text-gold-light">
                            <span className="w-1.5 h-1.5 rotate-45 bg-[#c9a24b]" aria-hidden="true" />
                            {job.heading}
                          </p>
                        )}
                        <p className="mt-1 text-gold-light font-semibold text-sm md:text-base">{job.company}</p>

                        <p className="mt-4 text-sm md:text-[0.95rem] text-[#c9c1ab] leading-relaxed">
                          {job.summary}
                        </p>

                        {job.mission && (
                          <div className="mt-5 rounded-xl border border-[#c9a24b]/30 bg-[#c9a24b]/[0.07] p-4">
                            <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#c9a24b] mb-1.5">
                              Mission
                            </p>
                            <p className="font-display italic text-sm md:text-[0.95rem] text-[#efe8d6] leading-relaxed">
                              {job.mission}
                            </p>
                          </div>
                        )}

                        <div className="mt-5 space-y-1">
                          {job.points.map((point, idx) => {
                            const isObj = typeof point === "object";
                            const title = isObj
                              ? point.title
                              : point.includes(":")
                              ? point.split(":")[0]
                              : undefined;
                            const text = isObj
                              ? point.text
                              : point.includes(":")
                              ? point.slice(point.indexOf(":") + 1).trim()
                              : point;

                            if (title) {
                              return (
                                <div key={idx} className="relative group/point">
                                  <div className="flex items-center gap-2.5">
                                    <span
                                      className="flex-shrink-0 w-2.5 h-2.5 rounded-full border border-[#c9a24b] bg-[#121009] flex items-center justify-center shadow-[0_0_8px_rgba(201,162,75,0.4)]"
                                      aria-hidden="true"
                                    >
                                      <span className="w-1 h-1 rounded-full bg-[#c9a24b]" />
                                    </span>
                                    <h4 className="font-semibold text-xs md:text-sm text-[#efe8d6] tracking-wide">
                                      {title}
                                    </h4>
                                  </div>
                                  <div className="ml-[4px] border-l border-dotted border-[#c9a24b]/40 pl-4 pt-1 pb-2.5">
                                    <p className="text-xs md:text-[0.875rem] text-[#b8b09d] leading-relaxed italic font-light">
                                      {text}
                                    </p>
                                  </div>
                                </div>
                              );
                            }

                            return (
                              <div key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-muted-foreground leading-relaxed py-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a24b] mt-2 flex-shrink-0" aria-hidden="true" />
                                <span>{text}</span>
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-6 flex flex-wrap gap-2">
                          {job.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-border bg-[#0d0b08] px-3 py-1 text-[11px] font-semibold tracking-wide text-[#b0a78f]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </article>
                    </Reveal>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Journey start marker */}
          <Reveal>
            <div className="relative mt-10 flex items-center gap-4 pl-14 md:pl-0 md:justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a24b]/40 bg-[#121009] px-5 py-2.5 text-xs font-bold tracking-[0.18em] uppercase text-gold-light">
                2013. The Journey Began
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
