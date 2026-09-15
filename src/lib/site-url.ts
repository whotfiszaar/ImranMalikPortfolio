/**
 * Resolves the canonical site URL dynamically based on environment:
 * 1. NEXT_PUBLIC_SITE_URL (custom domain if provided)
 * 2. VERCEL_PROJECT_PRODUCTION_URL (Vercel production domain)
 * 3. VERCEL_URL (Vercel deployment URL)
 * 4. Fallback to http://localhost:3000
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}
