"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { chapters, navItems } from "@/content/site";
import styles from "./Chrome.module.css";

/** Matches the CSS media query that turns on the pinned hero → about zoom. */
export const PIN_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

const clamp = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Fixed nav, progress rail and the single scroll driver for the page:
 * - [data-pin] sections get --p (0→1 while pinned) and data-stage="hero" | "about"
 * - [data-sp] elements get --sp (0 when entering the viewport, 1 when leaving)
 * - [data-reveal] elements get data-in="true" once they enter
 */
export function Chrome() {
  const [active, setActive] = useState<string>("top");
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const pinMq = window.matchMedia(PIN_QUERY);
    let pinned = pinMq.matches;
    let raf = 0;
    let lastY = window.scrollY;

    const pins = Array.from(document.querySelectorAll<HTMLElement>("[data-pin]"));
    const parallax = Array.from(document.querySelectorAll<HTMLElement>("[data-sp]"));
    const sections = chapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => !!el);

    const revealAll = (root: ParentNode) =>
      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => (el.dataset.in = "true"));

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const y = window.scrollY;

      for (const el of pins) {
        if (!pinned) {
          el.style.removeProperty("--p");
          delete el.dataset.stage;
          continue;
        }
        const r = el.getBoundingClientRect();
        const stageH = Math.max(vh, 560);
        const p = clamp(-r.top / Math.max(1, r.height - stageH));
        el.style.setProperty("--p", p.toFixed(4));
        // Close-up scale: the full-figure portrait (722:1000) grown to exactly the viewport width, top-aligned, as in Figma 2007:209.
        // Its soft side edges are faded in with --p in CSS, so they don't show in the close-up.
        el.style.setProperty("--s0", Math.max(1.6, window.innerWidth / (0.722 * stageH)).toFixed(4));
        const stage = p > 0.62 ? "about" : "hero";
        if (el.dataset.stage !== stage) {
          el.dataset.stage = stage;
          if (stage === "about") revealAll(el);
        }
      }

      for (const el of parallax) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        el.style.setProperty("--sp", clamp((vh - r.top) / (vh + r.height)).toFixed(4));
      }

      // Active chapter: the one crossing the upper third of the viewport.
      const probe = vh * 0.35;
      let current = sections[0]?.id ?? "top";
      for (const s of sections) if (s.getBoundingClientRect().top <= probe) current = s.id;
      setActive(current);

      // Once the page has scrolled, the nav gets a backdrop (small screens only, see CSS) so it stays legible over content.
      setSolid(y > 24);

      // Nav hides on scroll down and returns on scroll up.
      const dy = y - lastY;
      if (Math.abs(dy) > 6) {
        setHidden(dy > 0 && y > 160);
        lastY = y;
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          // Inside the pinned stage, callouts wait for the zoom-out instead of the viewport.
          if (pinned && el.closest("[data-pin]")) continue;
          el.dataset.in = "true";
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));

    const onMq = () => {
      pinned = pinMq.matches;
      if (!pinned) pins.forEach(revealAll);
      schedule();
    };
    if (!pinned) pins.forEach(revealAll);

    pinMq.addEventListener("change", onMq);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      pinMq.removeEventListener("change", onMq);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const activeNav = chapters.find((c) => c.id === active)?.nav ?? null;

  const jump = useCallback((id: string) => (e: React.MouseEvent) => {
    const target = resolveTarget(id);
    if (target == null) return;
    e.preventDefault();
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: target, behavior: smooth ? "smooth" : "auto" });
    history.replaceState(null, "", `#${id}`);
  }, []);

  return (
    <>
      <header className={styles.nav} data-hidden={hidden || undefined} data-solid={solid || undefined}>
        <a className={styles.wordmark} href="#top" onClick={jump("top")} aria-label="Joe Baltazar, back to top">
          <Image src="/logo.svg" alt="" width={40} height={40} priority />
        </a>
        <NavPill active={activeNav} onJump={jump} />
        <a className={styles.cta} href="#contact" onClick={jump("contact")}>
          Let’s talk
          <Image src="/icons/arrow-cta.svg" alt="" width={16} height={16} />
        </a>
      </header>

      <nav className={styles.rail} aria-label="Chapters">
        {chapters.map((c) => (
          <a
            key={c.id}
            href={`#${c.id}`}
            className={styles.dash}
            aria-current={c.id === active ? "true" : undefined}
            onClick={jump(c.id)}
          >
            <span className="sr-only">{c.label}</span>
          </a>
        ))}
      </nav>
    </>
  );
}

/** Scroll position for an anchor. "about" lives inside the pinned stage, so it maps to the end of the zoom-out. */
function resolveTarget(id: string): number | null {
  if (id === "about" && window.matchMedia(PIN_QUERY).matches) {
    const pin = document.getElementById("top");
    if (!pin) return null;
    return pin.offsetTop + (pin.offsetHeight - window.innerHeight) * 0.9;
  }
  const el = document.getElementById(id);
  if (!el) return null;
  return el.getBoundingClientRect().top + window.scrollY;
}

function NavPill({ active, onJump }: { active: string | null; onJump: (id: string) => (e: React.MouseEvent) => void }) {
  const listRef = useRef<HTMLUListElement>(null);
  const [indicator, setIndicator] = useState<{ x: number; w: number } | null>(null);

  // The active pill slides between items as each chapter enters.
  useLayoutEffect(() => {
    const measure = () => {
      const link = active ? listRef.current?.querySelector<HTMLElement>(`[data-id="${active}"]`) : null;
      setIndicator(link ? { x: link.offsetLeft, w: link.offsetWidth } : null);
    };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  return (
    <ul ref={listRef} className={styles.pill}>
      <li
        className={styles.indicator}
        aria-hidden
        style={indicator ? { transform: `translateX(${indicator.x}px)`, width: indicator.w, opacity: 1 } : { opacity: 0 }}
      />
      {navItems.map((item) => (
        <li key={item.id}>
          <a
            href={item.href}
            data-id={item.id}
            className={styles.link}
            aria-current={active === item.id ? "true" : undefined}
            onClick={onJump(item.id)}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
