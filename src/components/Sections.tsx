import Image from "next/image";
import Link from "next/link";
import { approach, contact, experience, quotes, site, whatIDo, work, type Role, type WorkTile } from "@/content/site";
import { Rich } from "./Rich";
import s from "./Sections.module.css";

const delay = (i: number, step = 90) => ({ "--reveal-delay": `${i * step}ms` }) as React.CSSProperties;

/* 03 · What I do (2008:220) */
export function WhatIDo() {
  return (
    <section id="what" className={`${s.section} ${s.green}`} aria-labelledby="what-title">
      <div className={s.inner}>
        <div className={s.introRow}>
          <div className={s.heading}>
            <p className="eyebrow" style={{ color: "var(--cream-70)" }}>
              {whatIDo.eyebrow}
            </p>
            <h2 id="what-title" className={`${s.display} serif`}>
              <Rich text={whatIDo.title} />
            </h2>
          </div>
          <figure className={s.fig} data-sp>
            <div className={s.figImage}>
              <Image src="/images/ruffle-detail.png" alt="Close-up of the ruffle detail on the green top" width={220} height={220} />
            </div>
            <figcaption className="serif">
              <em>{whatIDo.figCaption}</em>
            </figcaption>
          </figure>
        </div>

        <ul className={s.capabilities}>
          {whatIDo.capabilities.map((c, i) => (
            <li key={c.title} className={s.capability} data-reveal style={delay(i)}>
              <div className={s.capTitle}>
                <h3 className="serif">{c.title}</h3>
                <p className="serif">
                  <em>{c.role}</em>
                </p>
              </div>
              <div className={s.capDetail}>
                <p className={s.capDescription}>{c.description}</p>
                <p className={s.capTools}>{c.tools}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* 04 · Selected work (2008:257) */
export function Work() {
  return (
    <section id="work" className={`${s.section} ${s.paper} ${s.workSection}`} aria-labelledby="work-title">
      <div className={`${s.inner} ${s.innerWide}`}>
        <div className={`${s.introRow} ${s.workIntro}`}>
          <div className={s.heading}>
            <p className="eyebrow" style={{ color: "var(--ink-60)" }}>
              {work.eyebrow}
            </p>
            <h2 id="work-title" className={`${s.display} ${s.workTitle} serif`}>
              <Rich text={work.title} />
            </h2>
          </div>
          <p className={s.aside}>{work.aside}</p>
        </div>

        <ul className={s.tiles}>
          {work.tiles.map((t) => (
            <WorkTileCard key={t.slug} tile={t} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function WorkTileCard({ tile }: { tile: WorkTile }) {
  return (
    <li className={`${s.tile} ${s[tile.theme]}`} data-sp>
      <div className={s.tileCopy}>
        <div className={s.tileTop}>
          <p className={s.tileEyebrow}>{tile.eyebrow}</p>
          <h3 className={`${s.tileTitle} serif`}>{tile.title}</h3>
          <p className={s.tileRole}>{tile.role}</p>
        </div>
        <div className={s.tileBottom}>
          <p className={`${s.tileStat} serif`}>{tile.stat}</p>
          <p className={s.tileCaption}>{tile.statCaption}</p>
          <Link className={s.tileLink} href={`/work/${tile.slug}`}>
            Read the story
            <span className="sr-only">: {tile.title}</span>
            <Image src="/icons/arrow-light.svg" alt="" width={16} height={16} />
          </Link>
        </div>
      </div>
      <div className={s.visual} aria-hidden>
        <div className={s.screenDesktop}>
          <Image src={tile.desktop.src} alt="" fill sizes="(min-width: 1024px) 560px, 90vw" />
        </div>
        <div className={tile.device.kind === "tablet" ? s.screenTablet : s.screenPhone}>
          <Image src={tile.device.src} alt="" fill sizes="(min-width: 1024px) 345px, 50vw" />
        </div>
      </div>
    </li>
  );
}

/* 05 · Approach (2009:271) */
export function Approach() {
  return (
    <section id="approach" className={`${s.section} ${s.ink}`} aria-labelledby="approach-title">
      <div className={s.inner}>
        <div className={s.introRow}>
          <div className={s.heading}>
            <p className="eyebrow" style={{ color: "rgba(244,241,235,0.65)" }}>
              {approach.eyebrow}
            </p>
            <h2 id="approach-title" className={`${s.display} serif`}>
              <Rich text={approach.title} />
            </h2>
          </div>
          <p className={`${s.aside} ${s.asideLight}`}>{approach.aside}</p>
        </div>

        <ol className={s.principles}>
          {approach.principles.map((p, i) => (
            <li key={p.title} className={s.principle} data-reveal style={delay(i % 2)}>
              <p className={`${s.principleNumber} serif`} aria-hidden>
                <em>{String(i + 1).padStart(2, "0")}</em>
              </p>
              <h3 className="serif">{p.title}</h3>
              <p className={s.principleBody}>{p.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* 06 · Experience (2009:298) */
export function Experience() {
  return (
    <section id="experience" className={`${s.section} ${s.paper}`} aria-labelledby="experience-title">
      <div className={`${s.inner} ${s.experience}`}>
        <div className={s.expHeading}>
          <p className="eyebrow" style={{ color: "var(--ink-60)" }}>
            {experience.eyebrow}
          </p>
          <h2 id="experience-title" className={`${s.expTitle} serif`}>
            <Rich text={experience.title} />
          </h2>
          <p className={s.education}>{experience.education}</p>
        </div>
        <ol className={s.roles}>
          {experience.roles.map((r) => (
            <li key={`${r.company}-${r.dates}`}>
              <RoleRow role={r} />
              {r.clients ? (
                <ol className={s.clients} aria-label={`${r.company} client projects`}>
                  {r.clients.map((c) => (
                    <li key={`${c.company}-${c.dates}`}>
                      <RoleRow role={c} />
                    </li>
                  ))}
                </ol>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function RoleRow({ role }: { role: Role }) {
  return (
    <article className={s.role} data-reveal>
      <p className={s.roleDates}>{role.dates}</p>
      <div className={s.roleBody}>
        <h3 className="serif">{role.role}</h3>
        <p className={`${s.roleCompany} serif`}>
          <em>{role.company}</em>
        </p>
        <p className={s.roleDescription}>{role.description}</p>
      </div>
    </article>
  );
}

/* 07 · In their words (2009:346) */
export function Quotes() {
  return (
    <section id="words" className={`${s.section} ${s.green} ${s.quotes}`} aria-labelledby="words-title">
      <h2 id="words-title" className="eyebrow" style={{ color: "var(--cream-70)" }}>
        {quotes.eyebrow}
      </h2>
      {quotes.items.map((q, i) => (
        <figure key={q.attribution} className={s.quote} data-reveal style={delay(i, 120)}>
          <blockquote className="serif">
            <p>
              <em>{q.quote}</em>
            </p>
          </blockquote>
          <figcaption>{q.attribution}</figcaption>
        </figure>
      ))}
    </section>
  );
}

/* 08 · Contact — Portrait returns (2009:357) */
export function Contact() {
  return (
    <section id="contact" className={s.contact} data-sp aria-labelledby="contact-title">
      <div className={s.contactImage} aria-hidden>
        <Image src="/images/portrait.jpg" alt="" width={2849} height={3949} sizes="150vw" quality={90} />
      </div>
      <div className={s.contactFade} aria-hidden />

      <div className={s.contactCopy}>
        <p className={s.contactEyebrow}>{contact.eyebrow}</p>
        <h2 id="contact-title" className={`${s.contactTitle} serif`}>
          <Rich text={contact.title} />
        </h2>
        <p className={s.contactBody}>{contact.body}</p>
        <div className={s.contactActions}>
          <a className={s.emailButton} href={`mailto:${site.email}`}>
            {site.email}
            <Image src="/icons/arrow-email.svg" alt="" width={16} height={16} />
          </a>
          {site.linkedinUrl ? (
            <a className={s.underline} href={site.linkedinUrl} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          ) : null}
          {site.githubUrl ? (
            <a className={s.underline} href={site.githubUrl} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          ) : null}
        </div>
      </div>

      <footer className={s.footer}>
        <p>{contact.copyright}</p>
        <p>{contact.colophon}</p>
      </footer>
    </section>
  );
}
