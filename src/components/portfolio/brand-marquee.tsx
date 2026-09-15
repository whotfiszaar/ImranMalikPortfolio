import Image from "next/image";
import { BRANDS } from "@/lib/bio-data";

/**
 * Official brand logos, displayed on clean white tiles so every
 * wordmark stays crisp and legible on the dark theme.
 */
const LOGOS: Record<string, { src: string; w: number; h: number }> = {
  "Tira Beauty": { src: "/images/logos/tira-v2.png", w: 349, h: 160 },
  IKEA: { src: "/images/logos/ikea.png", w: 401, h: 160 },
  "Kama Ayurveda": { src: "/images/logos/kama.png", w: 171, h: 160 },
  "Forest Essentials": { src: "/images/logos/forest.png", w: 237, h: 160 },
};

export function BrandMarquee() {
  const items = [...BRANDS, ...BRANDS];
  return (
    <section
      aria-label="Brands Imran Malik has worked with"
      className="relative border-y border-border/70 bg-[#0d0b09] pt-8 pb-7 overflow-hidden"
    >
      <p className="mb-6 text-center text-[10px] md:text-[11px] font-bold tracking-[0.32em] uppercase text-[#b0a78f]">
        A decade shaped inside India&apos;s most loved retail brands
      </p>
      <div className="absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-[#0a0908] to-transparent pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-[#0a0908] to-transparent pointer-events-none" aria-hidden="true" />
      <div className="flex w-max animate-marquee items-center gap-12 pl-12">
        {items.map((brand, i) => {
          const logo = LOGOS[brand];
          return (
            <div key={`${brand}-${i}`} className="flex items-center gap-12" aria-hidden={i >= BRANDS.length}>
              {logo ? (
                <span className="flex h-[4.4rem] md:h-[4.8rem] items-center rounded-2xl border border-[#c9a24b]/25 bg-[#faf8f2] px-8 shadow-[0_10px_36px_-14px_rgba(0,0,0,0.75)]">
                  <Image
                    src={logo.src}
                    alt={`${brand} logo`}
                    width={logo.w}
                    height={logo.h}
                    sizes="(max-width: 768px) 90px, 110px"
                    className="h-10 md:h-11 w-auto object-contain"
                  />
                </span>
              ) : (
                <span className="font-display text-2xl md:text-[2rem] font-semibold text-[#f2ecdf]/55 whitespace-nowrap hover:text-gold-light transition-colors">
                  {brand}
                </span>
              )}
              <span className="w-1.5 h-1.5 rotate-45 bg-[#c9a24b]/50 flex-shrink-0" aria-hidden="true" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
