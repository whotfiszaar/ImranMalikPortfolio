import type { Metadata, Viewport } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { getSiteUrl } from "@/lib/site-url";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Imran Malik | Retail Operations & Business Leader in Beauty and Luxury Retail",
    template: "%s | Imran Malik",
  },
  description:
    "Imran Malik is a retail operations and business management leader in Mumbai with 10+ years across Tira Beauty, IKEA, Kama Ayurveda, and Forest Essentials. Operations Manager, multi-store operations expert, and customer experience specialist driving revenue growth.",
  keywords: [
    "Imran Malik",
    "Retail Operations Leader",
    "Operations Manager",
    "Store Director",
    "Retail Sales and Operations",
    "Beauty Retail India",
    "Luxury Retail Specialist",
    "Tira Beauty",
    "IKEA India",
    "Kama Ayurveda",
    "Forest Essentials",
    "Multi-Store Operations",
    "Customer Experience",
    "Retail Leadership Mumbai",
    "Store Operations Expert",
    "Retail Portfolio",
  ],
  authors: [{ name: "Imran Malik" }],
  creator: "Imran Malik",
  publisher: "Imran Malik",
  applicationName: "Imran Malik Portfolio",
  category: "Professional Portfolio",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "profile",
    url: siteUrl,
    siteName: "Imran Malik Portfolio",
    title: "Imran Malik | Retail Operations & Business Leader",
    description:
      "10+ years leading beauty and luxury retail across Tira Beauty, IKEA, Kama Ayurveda, and Forest Essentials. Operations Manager, multi-store operations, customer experience, and revenue growth.",
    locale: "en_IN",
    firstName: "Imran",
    lastName: "Malik",
    images: [
      {
        url: "/icons/og-image.png",
        width: 1200,
        height: 630,
        alt: "Imran Malik, Retail Operations and Business Management Leader in Mumbai",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Imran Malik | Retail Operations & Business Leader",
    description:
      "10+ years leading beauty and luxury retail across Tira Beauty, IKEA, Kama Ayurveda, and Forest Essentials.",
    images: ["/icons/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0a0908",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Imran Malik" />
        <meta name="format-detection" content="telephone=yes" />
      </head>
      <body
        className={`${playfair.variable} ${manrope.variable} antialiased bg-background text-foreground grain`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
