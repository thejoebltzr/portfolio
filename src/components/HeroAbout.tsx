import { Fragment } from "react";
import Image from "next/image";
import { about, hero, site } from "@/content/site";
import { CountUp } from "./CountUp";
import { Rich } from "./Rich";
import styles from "./HeroAbout.module.css";

/**
 * 01 · Hero — Study C on desktop (2057:334), Study C1 on phones and tablets (2067:342, 2070:364),
 * and 02 · About — Full portrait (2007:224).
 * Desktop with motion: one pinned stage. The portrait scales from the full-bleed close-up down to the
 * full figure while the backdrop fades from ink to studio grey and the copy swaps.
 * Mobile or reduced motion: two stacked sections.
 */
export function HeroAbout() {
  return (
    <section id="top" className={styles.pin} data-pin aria-label="Introduction">
      <div className={styles.stage}>
        <div className={styles.backdrop} aria-hidden />
        <div className={styles.ink} aria-hidden />

        {/* Hero */}
        <div className={styles.hero}>
          <div className={styles.heroImage} aria-hidden>
            <Image src="/images/portrait.jpg" alt="" fill priority sizes="(max-aspect-ratio: 1/1) 160vw, 100vw" quality={90} />
          </div>
          <div className={styles.fades} aria-hidden>
            <span className={styles.vignette} />
            <span className={styles.fadeBottom} />
            <span className={styles.fadeTop} />
          </div>
          <div className={styles.intro}>
            <p className={styles.heroEyebrow}>
              {hero.roles.map((role, i) => (
                <Fragment key={role}>
                  {i > 0 ? (
                    <span className={`${styles.amp} serif`}>&amp;</span>
                  ) : null}
                  <span>{role}</span>
                </Fragment>
              ))}
            </p>
            <h1 className={`${styles.heroTitle} serif`}>
              <Rich text={hero.title.slice(0, -1)} />
              <span className={styles.heroDot}>{hero.title.slice(-1)}</span>
            </h1>
            <p className={styles.lede}>{hero.lede}</p>
            <div className={styles.heroActions}>
              <a className={styles.primary} href={hero.primaryCta.href}>
                {hero.primaryCta.label}
                <Image src="/icons/arrow-dark.svg" alt="" width={16} height={16} />
              </a>
              {site.resumeUrl ? (
                <a className={styles.ghost} href={site.resumeUrl} download>
                  Download résumé
                  {/* Desktop (Study C) uses the arrow; phones and tablets (Study C1) use a download glyph. */}
                  <Image className={styles.iconDesktop} src="/icons/arrow-light.svg" alt="" width={16} height={16} />
                  <Image className={styles.iconCompact} src="/icons/download-light.svg" alt="" width={16} height={16} />
                </a>
              ) : null}
            </div>
            <p className={styles.since}>{hero.since}</p>
          </div>
          <dl className={styles.facts}>
            {hero.facts.map((f) => (
              <div key={f.label} className={styles.fact}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
            <div className={`${styles.fact} ${styles.factNext}`} aria-hidden>
              <dt>Next</dt>
              <dd>Scroll ↓</dd>
            </div>
          </dl>
        </div>

        {/* About */}
        <div id="about" className={styles.about}>
          <div className={styles.portrait}>
            <div className={styles.portraitBare} aria-hidden>
              <Image src="/images/portrait.jpg" alt="" fill sizes="(min-width: 1024px) 150vw, 100vw" quality={90} />
            </div>
            <div className={styles.portraitMasked}>
              <Image
                src="/images/portrait.jpg"
                alt="Joe Baltazar in a green ruffled top, standing against a grey studio backdrop"
                fill
                sizes="(min-width: 1024px) 150vw, 100vw"
                quality={90}
              />
            </div>
          </div>

          <div className={styles.aboutCopy}>
            <p className="eyebrow" style={{ color: "var(--cream-75)" }}>
              {about.eyebrow}
            </p>
            <h2 className={`${styles.aboutTitle} serif`}>
              <Rich text={about.title} />
            </h2>
            <p className={styles.aboutBody}>{about.body}</p>
          </div>

          <ul className={styles.callouts}>
            {about.stats.map((s, i) => (
              <li
                key={s.value}
                className={styles.callout}
                data-reveal
                style={{ "--reveal-delay": `${i * 180}ms` } as React.CSSProperties}
              >
                <span className={styles.leader} aria-hidden />
                <span className={styles.calloutCopy}>
                  <span className={`${styles.calloutValue} serif`}>
                    <span className="sr-only">{s.value}</span>
                    <CountUp value={s.value} />
                  </span>
                  <span className={styles.calloutLabel}>{s.label}</span>
                </span>
              </li>
            ))}
          </ul>

          <p className={styles.location}>
            <Image src="/icons/dot-location.svg" alt="" width={6} height={6} />
            {about.location}
          </p>
        </div>
      </div>
    </section>
  );
}
