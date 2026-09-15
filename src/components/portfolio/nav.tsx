"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageCircle } from "lucide-react";
import { NAV_LINKS, PROFILE } from "@/lib/bio-data";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track the active section
  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Lock body scroll when the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0a0908]/85 backdrop-blur-xl border-b border-border shadow-[0_8px_40px_-12px_rgba(0,0,0,0.8)]"
            : "bg-transparent"
        }`}
      >
        <nav
          className="mx-auto max-w-7xl px-5 md:px-8 h-[72px] flex items-center justify-between"
          aria-label="Main navigation"
        >
          {/* Monogram logo */}
          <a
            href="#top"
            className="group flex items-center gap-3"
            aria-label="Imran Malik, back to top"
          >
            <span className="w-10 h-10 rounded-xl border border-[#c9a24b]/60 flex items-center justify-center font-display text-lg font-bold text-gold-gradient bg-[#14110a] group-hover:border-[#c9a24b] transition-colors">
              IM
            </span>
            <span className="hidden sm:block font-display text-lg font-semibold tracking-wide text-foreground">
              Imran <span className="text-gold-gradient">Malik</span>
            </span>
          </a>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-colors rounded-full ${
                    active === link.href
                      ? "text-gold-light"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                  {active === link.href && (
                    <motion.span
                      layoutId="nav-dot"
                      className="absolute left-1/2 -translate-x-1/2 -bottom-0.5 w-1 h-1 rounded-full bg-[#c9a24b]"
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="gold-sweep hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#c9a24b] to-[#a8862f] text-[#16120a] text-sm font-bold tracking-wide hover:shadow-[0_8px_28px_-6px_rgba(201,162,75,0.55)] transition-shadow"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              Let&apos;s Talk
            </a>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="lg:hidden w-11 h-11 flex items-center justify-center rounded-full border border-border text-foreground hover:border-[#c9a24b] transition-colors"
              aria-label="Open menu"
              aria-expanded={open}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-[#0a0908]/97 backdrop-blur-2xl lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="h-[72px] px-5 flex items-center justify-between">
              <span className="font-display text-lg font-semibold text-foreground">
                Imran <span className="text-gold-gradient">Malik</span>
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-11 h-11 flex items-center justify-center rounded-full border border-border text-foreground hover:border-[#c9a24b] transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <motion.ul
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.06 } },
              }}
              className="px-8 pt-10 flex flex-col gap-2"
            >
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.href}
                  variants={{
                    hidden: { opacity: 0, x: -24 },
                    show: { opacity: 1, x: 0 },
                  }}
                >
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="group flex items-baseline gap-4 py-3 border-b border-border/60"
                  >
                    <span className="font-mono text-xs text-[#c9a24b]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-3xl font-semibold text-foreground group-hover:text-gold-light transition-colors">
                      {link.label}
                    </span>
                  </a>
                </motion.li>
              ))}
              <motion.li
                variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                className="pt-8"
              >
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="gold-sweep inline-flex items-center justify-center w-full px-6 py-4 rounded-full bg-gradient-to-r from-[#c9a24b] to-[#a8862f] text-[#16120a] text-base font-bold tracking-wide"
                >
                  Let&apos;s Talk
                </a>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
