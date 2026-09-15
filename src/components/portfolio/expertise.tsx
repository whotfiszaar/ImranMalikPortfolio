"use client";

import {
  Store,
  Crown,
  LayoutGrid,
  Target,
  Heart,
  Users,
  Calculator,
  Package,
  Rocket,
  Megaphone,
  Lightbulb,
  LineChart,
  Award,
  Gift,
  Globe,
  Check,
} from "lucide-react";
import { EXPERTISE, STRENGTHS } from "@/lib/bio-data";
import { Reveal, SectionHeading } from "./reveal";

const ICONS: Record<string, typeof Store> = {
  store: Store,
  crown: Crown,
  layout: LayoutGrid,
  target: Target,
  heart: Heart,
  users: Users,
  calculator: Calculator,
  package: Package,
  rocket: Rocket,
  megaphone: Megaphone,
  insight: Lightbulb,
  chart: LineChart,
  badge: Award,
  gift: Gift,
  globe: Globe,
};

export function Expertise() {
  return (
    <section id="expertise" className="relative py-24 md:py-32 overflow-hidden" aria-label="Core expertise and strengths">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 w-[28rem] h-[28rem] rounded-full bg-[#9a7a2e]/[0.06] blur-[120px]"
      />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Core Expertise"
          title={
            <>
              Skills That Move <span className="text-gold-gradient italic">the Numbers</span>
            </>
          }
          description="Fifteen areas of deep practice, built store by store, team by team, and market by market."
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 md:gap-4">
          {EXPERTISE.map((item, i) => {
            const Icon = ICONS[item.icon] ?? Store;
            return (
              <Reveal key={item.title} delay={Math.min(i * 0.04, 0.4)}>
                <div className="group h-full rounded-xl border border-border bg-[#121009]/70 p-4 md:p-5 text-center transition-all duration-500 hover:border-[#c9a24b]/55 hover:bg-[#161209] hover:-translate-y-1">
                  <span className="mx-auto flex w-11 h-11 rounded-lg border border-[#c9a24b]/35 bg-[#c9a24b]/[0.08] items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                    <Icon className="w-5 h-5 text-[#c9a24b]" aria-hidden="true" />
                  </span>
                  <p className="mt-3 text-[0.8rem] md:text-sm font-semibold text-[#e2dac6] leading-snug">
                    {item.title}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Key strengths ticker */}
        <div className="mt-16 md:mt-20">
          <Reveal>
            <p className="text-center eyebrow mb-6">Key Strengths</p>
          </Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-[#0d0b08] py-5">
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-20 z-10 bg-gradient-to-r from-[#0a0908] to-transparent pointer-events-none"
            />
            <div
              aria-hidden="true"
              className="absolute inset-y-0 right-0 w-20 z-10 bg-gradient-to-l from-[#0a0908] to-transparent pointer-events-none"
            />
            <div className="flex w-max animate-ticker gap-4 pl-4">
              {[...STRENGTHS, ...STRENGTHS].map((s, i) => (
                <span
                  key={`${s}-${i}`}
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[#c9a24b]/25 bg-[#c9a24b]/[0.06] px-4 py-2 text-xs md:text-sm font-semibold text-[#d6cdb6]"
                >
                  <Check className="w-3.5 h-3.5 text-[#c9a24b]" aria-hidden="true" />
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
