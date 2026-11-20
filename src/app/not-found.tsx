import Link from "next/link";

export const metadata = { title: "Not here yet — Joe Baltazar" };

export default function NotFound() {
  return (
    <main
      id="main"
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 28,
        padding: "96px var(--gutter)",
      }}
    >
      <p className="eyebrow" style={{ color: "var(--mint)" }}>
        Not here yet
      </p>
      <h1 className="serif" style={{ fontSize: "clamp(48px, 8vw, 120px)", lineHeight: 0.92, letterSpacing: "-0.02em" }}>
        This page is <em>still being written.</em>
      </h1>
      <p style={{ maxWidth: 520, fontSize: 18, lineHeight: 1.55, color: "var(--cream-75)" }}>
        The full case studies are on their way. In the meantime, the home page has the short version of each project.
      </p>
      <p>
        <Link href="/#work" style={{ fontWeight: 500, textUnderlineOffset: 3 }}>
          Back to the work
        </Link>
      </p>
    </main>
  );
}
