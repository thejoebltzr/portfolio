import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { BootLoader } from "@/components/BootLoader";

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
  title: "Joe Baltazar — Software Engineer",
  description:
    "Nine years building the parts of products people actually touch: on the web, on phones, and on the server when a feature needs it.",
  openGraph: {
    title: "Joe Baltazar — Software Engineer",
    description: "React and React Native work end to end, from offline-first POS tablets to wildfire-risk maps to multi-brand streaming apps.",
    // Wide 1200×630 card so LinkedIn and other link previews show the face and headline, not a cropped torso.
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Joe Baltazar — Hello, I’m Joe." }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
  },
};

// Waits for fonts + window load (min 1.6s so the intro plays through, max 3.2s so it never blocks),
// then adds .is-loaded to <html>, which closes the loader
// like a shutter. Once per tab session.
const BOOT_SCRIPT = `(function(){var d=document.documentElement;
try{if(sessionStorage.getItem("jb-boot")){d.classList.add("is-loaded","no-boot");return}}catch(e){}
var t0=Date.now(),done=false,fin=false;
function finish(){if(fin)return;fin=true;setTimeout(function(){done=true;d.classList.add("is-loaded");try{sessionStorage.setItem("jb-boot","1")}catch(e){}},Math.max(0,1600-(Date.now()-t0)))}
var fonts=document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve();
var load=new Promise(function(r){if(document.readyState==="complete")r();else window.addEventListener("load",r,{once:true})});
Promise.all([fonts,load]).then(finish,finish);setTimeout(finish,3200);})();`;

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
        <BootLoader />
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
