"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { GALLERY, GALLERY_CATEGORIES } from "@/lib/bio-data";
import { LQIP } from "@/lib/lqip";
import { Reveal, SectionHeading } from "./reveal";

export function Gallery() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const filtered = useMemo(
    () => (activeCategory === "all" ? GALLERY : GALLERY.filter((g) => g.category === activeCategory)),
    [activeCategory]
  );

  const next = useCallback(() => {
    setLightboxIndex((cur) => (cur === null ? null : (cur + 1) % filtered.length));
  }, [filtered.length]);

  const prev = useCallback(() => {
    setLightboxIndex((cur) => (cur === null ? null : (cur - 1 + filtered.length) % filtered.length));
  }, [filtered.length]);

  // Keyboard navigation for the lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, next, prev]);

  const current = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <section id="gallery" className="relative py-24 md:py-32 bg-[#0d0b08]" aria-label="Photo gallery">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Moments & Milestones"
          title={
            <>
              The Journey, <span className="text-gold-gradient italic">in Frames</span>
            </>
          }
          description="Team days, celebrations, workshops, and travel moments gathered across more than a decade of retail."
        />

        {/* Category filters */}
        <Reveal>
          <div className="flex flex-wrap justify-center gap-2.5 mb-10 md:mb-14" role="tablist" aria-label="Gallery categories">
            {GALLERY_CATEGORIES.map((cat) => {
              const count = cat.id === "all" ? GALLERY.length : GALLERY.filter((g) => g.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setLightboxIndex(null);
                  }}
                  className={`rounded-full px-4.5 py-2.5 text-xs md:text-sm font-bold tracking-wide transition-all duration-300 border ${
                    activeCategory === cat.id
                      ? "bg-gradient-to-r from-[#e6cd8a] to-[#c9a24b] text-[#16120a] border-transparent shadow-[0_8px_28px_-8px_rgba(201,162,75,0.55)]"
                      : "border-border bg-[#121009]/70 text-muted-foreground hover:border-[#c9a24b]/45 hover:text-foreground"
                  }`}
                >
                  {cat.label}
                  <span className={`ml-2 text-[10px] ${activeCategory === cat.id ? "text-[#16120a]/70" : "text-[#c9a24b]/70"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Masonry-ish grid */}
        <motion.div layout className="columns-2 md:columns-3 lg:columns-4 gap-4 [&>*]:mb-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((img, i) => (
              <motion.figure
                layout
                key={img.src}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.45, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                className="break-inside-avoid"
              >
                <button
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  className="group relative block w-full overflow-hidden rounded-2xl border border-border/70 focus-visible:ring-2 focus-visible:ring-[#c9a24b] outline-none"
                  aria-label={`Open photo: ${img.caption}`}
                >
                  <div className={`relative w-full ${img.orientation === "portrait" ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      placeholder="blur"
                      blurDataURL={LQIP[img.src.split("/").pop() ?? ""] ?? LQIP["hero.jpg"]}
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                      loading="lazy"
                    />
                  </div>
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#0a0908]/90 via-[#0a0908]/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-between gap-3">
                    <p className="text-left text-xs md:text-sm font-semibold text-[#f2ecdf] leading-snug">
                      {img.caption}
                    </p>
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#c9a24b]/90 flex items-center justify-center">
                      <Expand className="w-3.5 h-3.5 text-[#16120a]" aria-hidden="true" />
                    </span>
                  </div>
                </button>
              </motion.figure>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[80] flex flex-col bg-[#080706]/96 backdrop-blur-lg"
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (touchStartX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchStartX.current;
              if (Math.abs(dx) > 60) {
                if (dx < 0) next();
                else prev();
              }
              touchStartX.current = null;
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 md:px-8 h-[72px] border-b border-border/60">
              <div className="min-w-0">
                <p className="text-[10px] tracking-[0.22em] uppercase text-[#c9a24b] font-bold">
                  {GALLERY_CATEGORIES.find((c) => c.id === current.category)?.label}
                </p>
                <p className="truncate font-display text-base md:text-lg font-semibold text-foreground">
                  {current.caption}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="font-display text-sm text-muted-foreground" aria-live="polite">
                  {(lightboxIndex ?? 0) + 1} / {filtered.length}
                </span>
                <button
                  type="button"
                  onClick={() => setLightboxIndex(null)}
                  className="w-11 h-11 rounded-full border border-border flex items-center justify-center text-foreground hover:border-[#c9a24b] hover:text-gold-light transition-colors"
                  aria-label="Close photo viewer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Image */}
            <div className="relative flex-1 flex items-center justify-center p-4 md:p-10 overflow-hidden">
              <button
                type="button"
                onClick={prev}
                className="absolute left-3 md:left-6 z-10 w-12 h-12 rounded-full border border-border bg-[#121009]/80 backdrop-blur flex items-center justify-center text-foreground hover:border-[#c9a24b] hover:text-gold-light transition-colors"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <motion.div
                key={current.src}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full h-full max-w-5xl"
              >
                <Image
                  src={current.src}
                  alt={current.alt}
                  fill
                  sizes="90vw"
                  className="object-contain"
                  priority
                />
              </motion.div>

              <button
                type="button"
                onClick={next}
                className="absolute right-3 md:right-6 z-10 w-12 h-12 rounded-full border border-border bg-[#121009]/80 backdrop-blur flex items-center justify-center text-foreground hover:border-[#c9a24b] hover:text-gold-light transition-colors"
                aria-label="Next photo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Thumbnail strip */}
            <div className="hidden md:flex items-center justify-center gap-2.5 px-8 py-5 border-t border-border/60 overflow-x-auto nice-scroll">
              {filtered.map((img, i) => (
                <button
                  key={img.src}
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                    i === lightboxIndex ? "border-[#c9a24b] scale-105" : "border-transparent opacity-50 hover:opacity-90"
                  }`}
                  aria-label={`Go to photo ${i + 1}: ${img.caption}`}
                >
                  <Image src={img.src} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
