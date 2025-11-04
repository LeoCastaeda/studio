import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/lib/seo/site-config";

export const metadata: Metadata = {
  // Título base y plantilla
  title: {
    default:
      "Reparación e Instalación de Lunas de Coche en Barcelona | GlassNou",
    template: "%s | GlassNou",
  },
  description:
    "Taller experto en cristales de automoción en Barcelona. Sustitución de parabrisas y reparación de lunas con calidad OEM. Presupuesto rápido y atención el mismo día.",
  keywords: [
    "lunas para coche",
    "reparación de lunas",
    "cambio de parabrisas",
    "parabrisas Barcelona",
    "cristales coche Barcelona",
    "taller lunas Barcelona",
    "GlassNou",
  ],
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title:
      "Reparación e Instalación de Lunas de Coche en Barcelona | GlassNou",
    description:
      "Taller experto en cristales de automoción en Barcelona. Sustitución de parabrisas y reparación de lunas con calidad OEM.",
    url: "/",
    siteName: siteConfig.name,
    type: "website",
    locale: "es_ES",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Reparación e instalación de lunas y parabrisas en Barcelona - GlassNou",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Reparación e Instalación de Lunas de Coche en Barcelona | GlassNou",
    description:
      "Taller experto en cristales de automoción en Barcelona. Sustitución de parabrisas y reparación de lunas con calidad OEM.",
    images: [siteConfig.ogImage],
  },
  applicationName: siteConfig.name,
  category: "Automoción",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />

        {/* JSON-LD LocalBusiness (SEO local) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": siteConfig.business.type,
              "name": siteConfig.name,
              "image": `${siteConfig.url}${siteConfig.ogImage}`,
              "url": siteConfig.url,
              "telephone": siteConfig.contact.phone,
              "email": siteConfig.contact.email,
              "address": {
                "@type": "PostalAddress",
                "streetAddress": siteConfig.contact.address.street,
                "addressLocality": siteConfig.contact.address.city,
                "postalCode": siteConfig.contact.address.postalCode,
                "addressRegion": siteConfig.contact.address.region,
                "addressCountry": siteConfig.contact.address.country,
              },
              "areaServed": siteConfig.business.areaServed,
              "priceRange": siteConfig.business.priceRange,
              "sameAs": [siteConfig.links.facebook, siteConfig.links.instagram, siteConfig.links.tiktok],
            }),
          }}
        />
      </head>

      <body className={cn("min-h-screen bg-background font-body antialiased")}>
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
