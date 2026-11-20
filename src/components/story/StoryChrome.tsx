"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { navItems } from "@/content/site";
import chrome from "../Chrome.module.css";
import styles from "./Story.module.css";

/**
 * Story pages: floating nav (Work active, links back to the home chapters), the fixed reading-progress bar,
 * and the reveal observer for [data-reveal] elements.
 */
export function StoryChrome({ accent }: { accent: string }) {
  const [hidden, setHidden] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let lastY = window.scrollY;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
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
          (e.target as HTMLElement).dataset.in = "true";
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <>
      <div ref={barRef} className={styles.progress} style={{ background: accent }} aria-hidden />
      <header className={chrome.nav} data-hidden={hidden || undefined}>
        <Link className={`${chrome.wordmark} serif`} href="/">
          <em>Joe</em> Baltazar
        </Link>
        <ul className={chrome.pill}>
          {navItems.map((item) => (
            <li key={item.id}>
              <Link
                href={`/${item.href}`}
                className={`${chrome.link} ${item.id === "work" ? styles.navActive : ""}`}
                aria-current={item.id === "work" ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link className={chrome.cta} href="/#contact">
          Let’s talk
          <Image src="/icons/arrow-cta.svg" alt="" width={16} height={16} />
        </Link>
      </header>
    </>
  );
}
