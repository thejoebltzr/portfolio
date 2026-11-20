import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import type { Figure, Story as StoryData, StorySection } from "@/content/stories";
import { CountUp } from "../CountUp";
import { Rich } from "../Rich";
import s from "./Story.module.css";

type Tone = "ink" | "paper" | "deep";

/** Case-study page (Figma "Story — … (1440)" frames). Colours come from the story theme via CSS variables. */
export function Story({ story, next }: { story: StoryData; next: StoryData }) {
  const vars = {
    "--accent": story.theme.accent,
    "--deep": story.theme.deep,
  } as React.CSSProperties;

  return (
    <main id="main" className={s.story} style={vars}>
      <Hero story={story} />
      {story.sections.map((section, i) => (
        <Section key={i} section={section} />
      ))}
      <NextStory next={next} />
    </main>
  );
}

function Hero({ story }: { story: StoryData }) {
  return (
    <section className={`${s.section} ${s.ink} ${s.hero}`} aria-labelledby="story-title">
      <div className={s.inner}>
        <div className={s.heroTitle}>
          <Link className={s.back} href="/#work">
            <Image className={s.backArrow} src="/icons/arrow-back.svg" alt="" width={28} height={16} />
            All work
          </Link>
          <p className={s.heroEyebrow}>{story.eyebrow}</p>
          <h1 id="story-title" className="serif">
            <Rich text={story.title} />
          </h1>
        </div>
        <dl className={s.meta}>
          {story.meta.map((m) => (
            <div key={m.label}>
              <dt>{m.label}</dt>
              <dd>{m.text}</dd>
            </div>
          ))}
        </dl>
        <FigureView figure={story.hero} priority />
      </div>
    </section>
  );
}

function Header({ eyebrow, title, aside }: { eyebrow: string; title: string; aside?: string }) {
  return (
    <div className={s.header}>
      <div className={s.heading}>
        <p className={s.eyebrow}>{eyebrow}</p>
        <h2 className="serif">
          <Rich text={title} />
        </h2>
      </div>
      {aside ? <p className={s.aside}>{aside}</p> : null}
    </div>
  );
}

function Section({ section }: { section: StorySection }) {
  const tone: Tone = section.kind === "chapter" ? section.tone : section.kind === "gallery" ? "ink" : "deep";

  return (
    <section className={`${s.section} ${s[tone]}`}>
      <div className={s.inner}>
        <Header eyebrow={section.eyebrow} title={section.title} aside={"aside" in section ? section.aside : undefined} />

        {section.kind === "stakes" ? (
          <>
            <div className={s.halves}>
              {section.halves.map((h, i) => (
                <div key={h.title} className={s.half} data-reveal style={delay(i)}>
                  <h3 className="serif">{h.title}</h3>
                  <p>{h.body}</p>
                </div>
              ))}
            </div>
            <ul className={s.stats}>
              {section.stats.map((st, i) => (
                <li key={st.value} className={s.stat} data-reveal style={delay(i, 180)}>
                  <span className={s.leader} aria-hidden />
                  <span className={s.statCopy}>
                    <span className={`${s.statValue} serif`}>
                      <span className="sr-only">{st.value}</span>
                      <CountUp value={st.value} />
                    </span>
                    <span className={s.statLabel}>{st.label}</span>
                  </span>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {section.kind === "chapter" ? (
          <>
            {section.bigStat ? (
              <div className={s.bigStat} data-reveal>
                <p className={`${s.bigValue} serif`}>{section.bigStat.value}</p>
                <p className={s.bigText}>{section.bigStat.text}</p>
              </div>
            ) : null}
            {section.results ? (
              <div className={s.columns}>
                {section.results.map((r, i) => (
                  <div key={r.title} className={s.column} data-reveal style={delay(i)}>
                    <p className={`${s.resultValue} serif`}>{r.value}</p>
                    <h3 className={`${s.resultTitle} serif`}>{r.title}</h3>
                    <p className={s.resultBody}>{r.body}</p>
                  </div>
                ))}
              </div>
            ) : null}
            {section.points ? (
              <div className={s.columns}>
                {section.points.map((p, i) => (
                  <div key={p.title} className={s.column} data-reveal style={delay(i)}>
                    <h3 className={`${s.pointTitle} serif`}>{p.title}</h3>
                    <p className={s.pointBody}>{p.body}</p>
                  </div>
                ))}
              </div>
            ) : null}
            {section.flow ? <Flow flow={section.flow} /> : null}
            {section.code ? (
              <p className={s.code} data-reveal>
                <a className={s.codeLink} href={section.code.href} target="_blank" rel="noopener noreferrer">
                  {section.code.label}
                  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden>
                    <path d="M4.5 11.5l7-7M5.5 4.5h6v6" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  <span className="sr-only"> (GitHub, opens in a new tab)</span>
                </a>
                <span className={s.codeNote}>{section.code.note}</span>
              </p>
            ) : null}
            {section.figures ? <Figures figures={section.figures} /> : null}
          </>
        ) : null}

        {section.kind === "gallery" ? <Figures figures={section.figures} gallery /> : null}

        {section.kind === "lessons" ? (
          <ol className={s.lessons}>
            {section.cards.map((c, i) => (
              <li key={c.title} className={s.lesson} data-reveal style={delay(i % 2)}>
                <p className={`${s.lessonNumber} serif`} aria-hidden>
                  <em>{String(i + 1).padStart(2, "0")}</em>
                </p>
                <h3 className="serif">{c.title}</h3>
                <p className={s.lessonBody}>{c.body}</p>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </section>
  );
}

function Flow({ flow }: { flow: NonNullable<Extract<StorySection, { kind: "chapter" }>["flow"]> }) {
  const arrow = <Image className={s.flowArrow} src="/icons/arrow-flow.svg" alt="" width={28} height={16} aria-hidden />;
  return (
    <figure className={s.flow} data-reveal>
      <ol className={s.flowSteps}>
        {flow.steps.map((step) => (
          <li key={step.label} className={s.flowItem}>
            <span className={`${s.state} ${step.highlight ? s.stateOn : ""}`}>
              <span className={s.stateLabel}>{step.label}</span>
              {step.sub ? <span className={s.stateSub}>{step.sub}</span> : null}
            </span>
            {arrow}
          </li>
        ))}
        <li className={s.outcomes}>
          <ul>
            {flow.outcomes.map((o) => (
              <li key={o} className={s.state}>
                <span className={s.stateLabel}>{o}</span>
              </li>
            ))}
          </ul>
        </li>
      </ol>
    </figure>
  );
}

function Figures({ figures, gallery = false }: { figures: Figure[]; gallery?: boolean }) {
  return (
    <div className={`${s.figures} ${figures.length > 1 ? s.twoUp : ""} ${gallery ? s.gallery : ""}`}>
      {figures.map((f) => (
        <FigureView key={f.caption} figure={f} small={figures.length > 1} />
      ))}
    </div>
  );
}

function FigureView({ figure, small = false, priority = false }: { figure: Figure; small?: boolean; priority?: boolean }) {
  return (
    <figure className={s.figure} data-reveal={priority ? undefined : true}>
      {figure.kind === "image" ? (
        <div className={s.frame}>
          <Image
            src={figure.src}
            alt={figure.alt}
            width={figure.width}
            height={figure.height}
            priority={priority}
            sizes={small ? "(min-width: 1024px) 584px, 100vw" : "(min-width: 1280px) 1200px, 100vw"}
          />
        </div>
      ) : (
        <div className={`${s.frame} ${s.phones} ${small ? s.phonesSmall : ""}`}>
          {figure.srcs.map((p) => (
            <div key={p.src} className={s.phone}>
              <Image src={p.src} alt={p.alt} fill sizes={small ? "(min-width: 1024px) 142px, 45vw" : "(min-width: 1024px) 267px, 45vw"} />
            </div>
          ))}
        </div>
      )}
      <figcaption>{figure.caption}</figcaption>
    </figure>
  );
}

function NextStory({ next }: { next: StoryData }) {
  return (
    <section className={`${s.section} ${s.ink} ${s.nextSection}`} aria-label="Next story">
      <div className={s.inner}>
        <Link
          href={`/work/${next.slug}`}
          className={s.nextCard}
          style={{ "--next-tile": next.theme.tile, "--next-accent": next.theme.accent } as React.CSSProperties}
        >
          <span className={s.nextCopy}>
            <span className={s.nextEyebrow}>Next story · {next.via}</span>
            <span className={`${s.nextTitle} serif`}>{next.teaser}</span>
          </span>
          <span className={s.nextButton}>
            Read the story
            <Image src="/icons/arrow-next.svg" alt="" width={16} height={16} />
          </span>
        </Link>
        <footer className={s.footer}>
          <p>© 2026 Joe Arlo Baltazar</p>
          <p>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            {site.linkedinUrl ? (
              <>
                {" · "}
                <a href={site.linkedinUrl} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </>
            ) : null}
            {site.githubUrl ? (
              <>
                {" · "}
                <a href={site.githubUrl} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </>
            ) : null}
          </p>
        </footer>
      </div>
    </section>
  );
}

const delay = (i: number, step = 90) => ({ "--reveal-delay": `${i * step}ms` }) as React.CSSProperties;
