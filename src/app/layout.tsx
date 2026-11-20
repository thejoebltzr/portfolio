import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";

const serif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Joe Baltazar — Senior frontend & mobile engineer",
  description:
    "Nine years building the parts of products people actually touch: on the web, on phones, and on the server when a feature needs it.",
  openGraph: {
    title: "Joe Baltazar — Senior frontend & mobile engineer",
    description: "React and React Native work end to end, from offline-first POS tablets to wildfire-risk maps to multi-brand streaming apps.",
    images: [{ url: "/images/portrait.jpg", width: 2849, height: 3949, alt: "Portrait of Joe Baltazar" }],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#141412",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        {/* Marks JS as available so reveal animations start hidden; without JS, content stays visible. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
