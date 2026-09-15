import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Imran Malik | Retail Operations & Business Leader",
    short_name: "Imran Malik",
    description:
      "Portfolio of Imran Malik, retail operations and business management leader in beauty and luxury retail. 10+ years across Tira Beauty, IKEA, Kama Ayurveda, and Forest Essentials.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0908",
    theme_color: "#0a0908",
    orientation: "portrait-primary",
    categories: ["business", "portfolio", "professional"],
    lang: "en-IN",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Career Journey",
        url: "/#journey",
        description: "See Imran's career timeline",
      },
      {
        name: "Gallery",
        url: "/#gallery",
        description: "Browse moments and milestones",
      },
      {
        name: "Contact",
        url: "/#contact",
        description: "Get in touch with Imran",
      },
    ],
  };
}
