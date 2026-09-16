import { Nav } from "@/components/portfolio/nav";
import { Hero } from "@/components/portfolio/hero";
import { BrandMarquee } from "@/components/portfolio/brand-marquee";
import { About } from "@/components/portfolio/about";
import { Highlights } from "@/components/portfolio/highlights";
import { Expertise } from "@/components/portfolio/expertise";
import { Journey } from "@/components/portfolio/journey";
import { Philosophy } from "@/components/portfolio/philosophy";
import { Gallery } from "@/components/portfolio/gallery";
import { Recommendations } from "@/components/portfolio/recommendations";
import { Education } from "@/components/portfolio/education";
import { Contact } from "@/components/portfolio/contact";
import { Footer } from "@/components/portfolio/footer";
import { ChatWidget } from "@/components/portfolio/chat-widget";
import { SWRegister } from "@/components/portfolio/sw-register";
import { PROFILE, CAREER, EXPERTISE } from "@/lib/bio-data";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: "Imran Malik",
    givenName: "Imran",
    familyName: "Malik",
    jobTitle: "National NSO Lead / Operations Manager",
    description:
      "Retail Operations Leader & System Builder scaling multi-store ecosystems and high-performance teams across India's beauty and luxury retail sector.",
    email: "mailto:imrankn22@gmail.com",
    telephone: "+919168422339",
    url: siteUrl,
    image: `${siteUrl}/icons/og-image.png`,
    sameAs: [
      "https://www.linkedin.com/in/imran-kn/",
      "https://wa.me/919168422339",
      "https://mobile.twitter.com/imra1khan",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mumbai",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
    nationality: "Indian",
    worksFor: [
      { "@type": "Organization", name: "Tira Beauty" },
      { "@type": "Organization", name: "Smart Co. Dubai (BinDubai LLC)" },
      { "@type": "Organization", name: "IKEA" },
      { "@type": "Organization", name: "Kama Ayurveda" },
      { "@type": "Organization", name: "Forest Essentials" },
    ],
    alumniOf: [
      {
        "@type": "EducationalOrganization",
        name: "University of Mumbai",
      },
      {
        "@type": "EducationalOrganization",
        name: "iFEEL - Institute for Future Education Entrepreneurship and Leadership",
      },
      { "@type": "EducationalOrganization", name: "Sinhgad Institute of Management" },
    ],
    knowsAbout: EXPERTISE.map((e) => e.title),
    knowsLanguage: ["English", "Hindi"],
    hasOccupation: {
      "@type": "Occupation",
      name: "Retail Operations and Business Management Leader",
      occupationLocation: {
        "@type": "City",
        name: "Mumbai",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function BreadcrumbJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Career Journey",
        item: `${siteUrl}/#journey`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "Imran Malik | Retail Operations & Business Leader",
    url: siteUrl,
    description:
      "Retail Operations and Business Management Leader with 10+ years across India's beauty and luxury retail sector.",
    inLanguage: "en-IN",
    publisher: {
      "@id": `${siteUrl}/#person`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function Page() {
  return (
    <>
      <WebSiteJsonLd />
      <PersonJsonLd />
      <BreadcrumbJsonLd />
      <SWRegister />
      <div className="flex min-h-svh flex-col bg-background">
        <Nav />
        <main className="flex-1">
          <Hero />
          <BrandMarquee />
          <About />
          <Highlights />
          <Expertise />
          <Journey />
          <Philosophy />
          <Gallery />
          <Recommendations />
          <Education />
          <Contact />
        </main>
        <Footer />
      </div>
      <ChatWidget />
    </>
  );
}
