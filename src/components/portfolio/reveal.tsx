"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}

/** Scroll-triggered reveal animation used across all sections. */
export function Reveal({ children, delay = 0, y = 28, className, once = true }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
}

/** Shared section heading with eyebrow, serif title, and hairline. */
export function SectionHeading({ eyebrow, title, description, align = "center" }: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-3xl ${alignClass} mb-14 md:mb-20`}>
      <Reveal>
        <p className="eyebrow mb-4">{eyebrow}</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="font-display text-4xl md:text-5xl lg:text-[3.4rem] leading-[1.08] font-semibold text-foreground">
          {title}
        </h2>
      </Reveal>
      <Reveal delay={0.16}>
        <div className={`gold-hairline mt-6 mb-6 ${align === "center" ? "w-40 mx-auto" : "w-40"}`} />
      </Reveal>
      {description ? (
        <Reveal delay={0.22}>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">{description}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
