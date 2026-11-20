"use client";

import { useEffect, useRef, useState } from "react";

type Parsed = { prefix: string; from: number; to: number; decimals: number; grouped: boolean; suffix: string };

/** "2,275+" counts 0 → 2275; "0.71 → 0.86" keeps "0.71 → " and counts 0.71 → 0.86. */
function parse(value: string): Parsed | null {
  const arrow = value.lastIndexOf("→");
  const head = arrow >= 0 ? value.slice(0, arrow + 1) + " " : "";
  const tail = arrow >= 0 ? value.slice(arrow + 1).trim() : value;
  const m = tail.match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/);
  if (!m) return null;
  const raw = m[2];
  const to = Number(raw.replace(/,/g, ""));
  const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
  let from = 0;
  if (arrow >= 0) {
    const f = value.slice(0, arrow).match(/([\d,]*\.?\d+)/);
    if (f) from = Number(f[1].replace(/,/g, ""));
  }
  return { prefix: head + m[1], from, to, decimals, grouped: raw.includes(","), suffix: m[3] };
}

function format(n: number, p: Parsed) {
  const s = n.toLocaleString("en-US", {
    minimumFractionDigits: p.decimals,
    maximumFractionDigits: p.decimals,
    useGrouping: p.grouped,
  });
  return `${p.prefix}${s}${p.suffix}`;
}

/**
 * Counts a stat up when its closest [data-reveal] ancestor gets data-in="true".
 * Server render and reduced motion show the final value.
 */
export function CountUp({ value, duration = 1400 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(value);

  useEffect(() => {
    const el = ref.current;
    const parsed = parse(value);
    const host = el?.closest<HTMLElement>("[data-reveal]");
    if (!el || !parsed || !host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setText(format(parsed.from + (parsed.to - parsed.from) * eased, parsed));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    if (host.dataset.in === "true") return;
    setText(format(parsed.from, parsed));
    const mo = new MutationObserver(() => {
      if (host.dataset.in === "true") {
        mo.disconnect();
        // Let the leader line draw first.
        window.setTimeout(run, 350);
      }
    });
    mo.observe(host, { attributes: true, attributeFilter: ["data-in"] });
    return () => {
      mo.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref} aria-hidden>
      {text}
    </span>
  );
}
