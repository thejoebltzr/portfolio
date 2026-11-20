import { Fragment } from "react";

/** Renders "Plain [italic] plain" with the bracketed span as <em>, matching the serif headings in the design. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\])/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("[") ? <em key={i}>{part.slice(1, -1)}</em> : <Fragment key={i}>{part}</Fragment>,
      )}
    </>
  );
}
