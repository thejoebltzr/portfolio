import type { MetadataRoute } from "next";

// Home-screen and tab icons for Android, iPad and other mobile browsers.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Joe Baltazar — Software Engineer",
    short_name: "Joe Baltazar",
    start_url: "/",
    display: "browser",
    background_color: "#141412",
    theme_color: "#141412",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
