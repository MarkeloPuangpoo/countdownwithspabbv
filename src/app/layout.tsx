import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

// ============================================================================
// FONT CONFIGURATION
// ============================================================================
const anakotmai = localFont({
  src: [
    { path: "./font/Anakotmai-Light.ttf", weight: "300", style: "normal" },
    { path: "./font/Anakotmai-Medium.ttf", weight: "500", style: "normal" },
    { path: "./font/Anakotmai-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-anakotmai",
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

// ============================================================================
// CONFIGURATION CONSTANTS
// ============================================================================
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://countdownwithspabbv.vercel.app/";
const SITE_NAME = "spaBBV Countdown 2026";
const SCHOOL_NAME_TH = "โรงเรียนบางปะกง “บวรวิทยายน”";
const SCHOOL_NAME_EN = "Bangpakong Bowonwittayayon School";
const EVENT_NAME = "BBV New Year 2026 Countdown";
const AUTHOR_NAME = "spaBBV Student Council";
const DEV_TEAM = "Pondet & spaBBV Dev Team";

const SITE_DESCRIPTION =
  `🎉 นับถอยหลังสู่ปีใหม่ 2026 กับสภานักเรียน${SCHOOL_NAME_TH} (spaBBV) ร่วมส่งคำอวยพรและฉลองช่วงเวลาข้ามปีไปด้วยกัน! Realtime wishes & Live Countdown.`;

// ============================================================================
// METADATA (ULTIMATE SEO MERGE)
// ============================================================================
export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: `🎆 ${SITE_NAME} | นับถอยหลังปีใหม่กับสภานักเรียน BBV`,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    applicationName: "spaBBV Countdown",
    authors: [{ name: AUTHOR_NAME, url: "https://www.facebook.com/bbv.038531400" }],
    generator: "Next.js 15",

    // Keywords: รวมคำค้นหาท้องถิ่นและคำทั่วไป
    keywords: [
      "นับถอยหลังปีใหม่ 2026", "Countdown 2026", "ปีใหม่ 2569",
      "สภานักเรียน BBV", "spaBBV", "บางปะกงบวรวิทยายน",
      "โรงเรียนบางปะกง", "ฉะเชิงเทรา", "Bang Pakong",
      "Bangpakong Borawittayayon", "New Year Wishes", "Virtual Event",
      "เคาท์ดาวน์ออนไลน์", "ส่งคำอวยพร", "Live สดปีใหม่"
    ],
    creator: DEV_TEAM,
    publisher: AUTHOR_NAME,

    // Robots: อนุญาตให้เก็บข้อมูลเต็มรูปแบบ
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Open Graph (Facebook, Discord, Line)
    openGraph: {
      type: "website",
      locale: "th_TH",
      alternateLocale: ["en_US"],
      url: BASE_URL,
      siteName: SITE_NAME,
      title: `🎆 พร้อมหรือยัง? ${EVENT_NAME}`,
      description: "มาร่วมเป็นส่วนหนึ่งของค่ำคืนสุดพิเศษ ส่งคำอวยพรขึ้นจอแบบ Realtime!",
      images: [
        {
          url: "/og-image.png", // แนะนำขนาด 1200x630px
          width: 1200,
          height: 630,
          alt: `${EVENT_NAME} Banner`,
        },
      ],
    },

    // Apple Web App (PWA feel)
    appleWebApp: {
      capable: true,
      title: "BBV Countdown",
      statusBarStyle: "black-translucent",
    },

    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png",
      other: [
        {
          rel: "mask-icon",
          url: "/safari-pinned-tab.svg",
          color: "#050505",
        },
      ],
    },

    alternates: {
      canonical: BASE_URL,
    },
  };
}

// ============================================================================
// VIEWPORT
// ============================================================================
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#050505",
  colorScheme: "dark",
};

// ============================================================================
// STRUCTURED DATA (JSON-LD)
// ============================================================================
const jsonLd = {
  organization: {
    "@context": "https://schema.org",
    "@type": "School",
    "name": SCHOOL_NAME_EN,
    "alternateName": [SCHOOL_NAME_TH, "BBV"],
    "url": BASE_URL,
    "logo": `${BASE_URL}/logo.png`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bang Pakong",
      "addressRegion": "Chachoengsao",
      "addressCountry": "TH"
    },
    "sameAs": [
      "https://www.facebook.com/bbv.038531400"
    ]
  },
  event: {
    "@context": "https://schema.org",
    "@type": "SocialEvent",
    "name": EVENT_NAME,
    "description": SITE_DESCRIPTION,
    "startDate": "2025-12-31T18:00:00+07:00",
    "endDate": "2026-01-01T01:00:00+07:00",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
    "location": {
      "@type": "VirtualLocation",
      "url": BASE_URL
    },
    "image": [`${BASE_URL}/og-image.png`],
    "organizer": {
      "@type": "Organization",
      "name": AUTHOR_NAME,
      "url": BASE_URL
    },
    "offers": {
      "@type": "Offer",
      "url": BASE_URL,
      "price": "0",
      "priceCurrency": "THB",
      "availability": "https://schema.org/InStock",
      "validFrom": "2025-12-01T00:00:00+07:00"
    }
  }
};

// ============================================================================
// COMPONENT
// ============================================================================
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="dark scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.organization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.event) }}
        />
      </head>
      <body
        className={`${anakotmai.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[#050505] text-white selection:bg-purple-500 selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}