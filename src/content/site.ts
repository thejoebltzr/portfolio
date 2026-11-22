// All home-page copy, taken from the Figma revamp (Desktop — Home, node 2007:208).
// Text in [square brackets] inside a string marks the italic span of a serif heading.

export const site = {
  name: "Joe Baltazar",
  email: "thejoebaltazar@gmail.com",
  // Fill these in to show the links. Empty values are hidden rather than linking nowhere.
  linkedinUrl: "https://www.linkedin.com/in/joe-arlo-baltazar-458895117?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
  githubUrl: "https://github.com/thejoebltzr",
  resumeUrl: "/Joe_Arlo_Baltazar_Resume.pdf",
};

// Hero — Study C (Figma 2057:334): centered close-up, centered intro, fact bar along the bottom.
export const hero = {
  // Rendered as "ROLE & ROLE" with a serif italic ampersand between them.
  roles: ["Software engineer", "Project lead"],
  // The last character (the period) is set in the accent colour.
  title: "[Joe] Baltazar.",
  lede: "Nine years building the parts of products people actually touch: on the web, on phones, and on the server when a feature needs it.",
  primaryCta: { label: "See selected work", href: "#work" },
  // Desktop fact bar (Study C). Phones and tablets show only `since` under the buttons (Study C1).
  facts: [
    { label: "Focus", value: "Full stack, end to end" },
    { label: "Since", value: "2017 — nine years" },
  ],
  since: "Since 2017",
};

export const about = {
  eyebrow: "About",
  // "\n" forces a line break.
  title: "I build it,\nand I [ship it].",
  body: "I lead React and React Native work end to end, from offline-first POS tablets to wildfire-risk maps to multi-brand streaming apps. I build the backend piece when a feature needs it, and I run the delivery side too: planning, scoping and keeping releases on track. I use AI tools where they help, under the same tests, type checks and code review as everything else I ship.",
  location: "Calabarzon, Philippines · Working remotely",
  stats: [
    { value: "9+", label: "Years shipping web and mobile" },
    { value: "3", label: "Platforms in production that I lead or co-lead" },
    { value: "2,275+", label: "Commits to one restaurant POS and its dashboard" },
    { value: "0.71 → 0.86", label: "React Native, upgraded in place without a delivery freeze" },
  ],
};

export const whatIDo = {
  eyebrow: "What I do",
  title: "Senior on the client side. [Fluent] on the server side.",
  figCaption: "Fig. 1 — attention to detail",
  capabilities: [
    {
      title: "Frontend",
      role: "Primary",
      description:
        "React, Next.js and Angular apps that make dense data readable: risk maps, dashboards, checkout. Typed end to end and covered by end-to-end tests.",
      tools: "React · Next.js · Angular · TypeScript · TanStack Query · Mapbox GL · Playwright",
    },
    {
      title: "Mobile",
      role: "Primary",
      description:
        "React Native apps that ship to both stores and hold up in real use: offline-first sync, long sessions in the field, native upgrades, store payment policy.",
      tools: "React Native · Expo · PowerSync · Stripe · Auth0 · Firebase · Crashlytics",
    },
    {
      title: "Backend",
      role: "When it matters",
      description:
        "Enough backend to own a feature end to end: Postgres schemas and migrations, edge functions, and integrations with outboxes and reconciliation.",
      tools: "Postgres · Supabase · Deno · Docker · AWS · GitHub Actions · Sentry",
    },
    {
      title: "AI-assisted engineering",
      role: "With guardrails",
      description:
        "AI is a tool in my workflow, not a substitute for engineering judgment. I use it for scaffolding, large mechanical refactors and first drafts of tests, and its output passes the same typed contracts, CI checks and review as any other code. Architecture, data correctness and anything that touches money I reason through and verify myself.",
      tools: "Claude Code · Cursor · Herdr · T3 Code",
    },
    {
      title: "Project management",
      role: "Alongside the code",
      description:
        "I plan and run delivery for the work I lead: writing the tickets, running sprints, sequencing releases and keeping stakeholders informed. I’ve led teams since OBPO, was promoted to Project Manager at rebootthefuture, and hold a Postgraduate Certificate in Project Management from the Asian Institute of Management.",
      tools:
        "Sprint planning · Release management · Stakeholder updates · Jira · Linear · MeisterTask · Asian Institute of Management",
    },
  ],
};

export type WorkTile = {
  slug: string;
  theme: "goodcode" | "overwatch" | "xstreamr";
  eyebrow: string;
  title: string;
  role: string;
  stat: string;
  statCaption: string;
  desktop: { src: string; alt: string };
  device: { kind: "tablet" | "phone"; src: string; alt: string };
};

export const work = {
  eyebrow: "Selected work",
  title: "Three products in production, each with [money or risk] riding on it.",
  aside:
    "In each one, a wrong number has real consequences: a double card charge, a missed at-risk property, a payment the app store won’t approve.",
  tiles: [
    {
      slug: "good-code",
      theme: "goodcode",
      eyebrow: "Good Code · 2024 — now",
      title: "A restaurant POS that can’t go down during dinner service, or get the money wrong",
      role: "Core engineer · Offline-first POS and back-office dashboard",
      stat: "54 → 0",
      statCaption:
        "At-risk sale attempts in 60 days. Possible double charges now go through a durable “uncertain” state with status polling, never a blind retry.",
      desktop: { src: "/images/work-goodcode-desktop.png", alt: "Good Code back-office dashboard home" },
      device: { kind: "tablet", src: "/images/work-goodcode-tablet.png", alt: "Good Code POS menu grid on an Android tablet" },
    },
    {
      slug: "overwatch",
      theme: "overwatch",
      eyebrow: "Overwatch · via NTERSOL · 2025 — now",
      title: "Wildfire exposure for insurers, on a phone and on the web",
      role: "Lead mobile engineer (226 of 232 commits) · Senior engineer on web correctness",
      stat: "20% → 100%",
      statCaption:
        "Hurricane exposure was silently scored on a 1,000-row sample of a 5,035-location portfolio. Fixed, and covered by tests.",
      desktop: { src: "/images/work-overwatch-desktop.png", alt: "Overwatch web wildfire overview map" },
      device: { kind: "phone", src: "/images/work-overwatch-phone.png", alt: "Overwatch mobile portfolio map with active fires" },
    },
    {
      slug: "xstreamr",
      theme: "xstreamr",
      eyebrow: "XStreamr · via NTERSOL · 2026 — now",
      title: "Two brands on one codebase, with payments the app stores approve",
      role: "Lead engineer, client platforms · iOS, Android and web",
      stat: "0 unhandled",
      statCaption:
        "API contract gaps. A CI check compares every client call with the backend’s real routes, so a contract break fails the PR before it reaches QA.",
      desktop: { src: "/images/work-xstreamr-desktop.png", alt: "XStreamr web home for fans" },
      device: { kind: "phone", src: "/images/work-xstreamr-phone.png", alt: "XStreamr mobile home with a ticketed event" },
    },
  ] satisfies WorkTile[],
};

export const approach = {
  eyebrow: "How I work",
  title: "Senior means making the right thing the [easy] thing.",
  aside: "What I bring to a team beyond the tickets: written decisions, automated checks, and bugs fixed at the root.",
  principles: [
    {
      title: "A wrong number is worse than no number",
      body: "For payments and risk data, I design for the ambiguous case first: uncertain states, reconciliation, and tests that prove the totals add up.",
    },
    {
      title: "Contracts as code",
      body: "API drift should fail a pull request, not a QA pass. I put contracts, policies and invariants where CI can check them.",
    },
    {
      title: "Ratchet, don’t block",
      body: "Baselines for type errors and lint that can only go down, so legacy code gets better every week without stopping feature work.",
    },
    {
      title: "Upgrade in place",
      body: "React Native 0.71 → 0.86 and Angular 14 → 21, one step at a time, with the app shippable at every commit.",
    },
  ],
};

export type Role = { dates: string; role: string; company: string; description: string; clients?: Role[] };

export const experience = {
  eyebrow: "Experience",
  title: "Nine years of shipping, most recently [as lead.]",
  education:
    "Education — Postgraduate Certificate in Project Management, Asian Institute of Management, completed. BS Information Technology, STI College (2013 — 2017).",
  roles: [
    {
      dates: "Mar 2023 — now",
      role: "Senior Engineer",
      company: "Contract Engineering",
      description:
        "Long-term engagements with US-based product teams, via NTERSOL and Good Code. The platforms I lead are below.",
      clients: [
        {
          dates: "Sep 2026 — now",
          role: "Lead Engineer, Client Platforms",
          company: "XStreamr · via NTERSOL",
          description: "Rebuilt the iOS, Android and web clients on a new API. Multi-brand builds, Stripe, CI contract checks.",
        },
        {
          dates: "Aug — Sep 2026",
          role: "Senior Engineer, Data Correctness",
          company: "Overwatch (Web) · via NTERSOL",
          description:
            "Owned correctness across hurricane, wildfire, portfolio upload and map pins. Stabilised the end-to-end suite.",
        },
        {
          dates: "Mar 2025 — now",
          role: "Lead Mobile Engineer",
          company: "Overwatch (Mobile) · via NTERSOL",
          description: "Owned architecture, maps, auth and App Store / Play releases from the first commit.",
        },
        {
          dates: "Feb 2024 — now",
          role: "Project Manager · promoted from Core Engineer",
          company: "Good Code · rebootthefuture",
          description:
            "Promoted to Project Manager for the team shipping Good Code: POS, kitchen routing and online ordering. Still hands-on as core engineer on payments, offline sync, reports, integrations (7shifts, NowBookIt, Nory) and CI.",
        },
      ],
    },
    {
      dates: "Apr 2018 — Feb 2024",
      role: "Software Engineer",
      company: "OBPO, Inc.",
      description:
        "Started in frontend and iOS, then led the team and ran sprints in MeisterTask. Built the Outbounders, OBPO and Coravida sites, the Coravida admin in Laravel, and early React Native work.",
    },
    {
      dates: "Aug — Oct 2017",
      role: "Web Developer",
      company: "Penbrothers",
      description: "Web development, straight after finishing my IT degree.",
    },
    {
      dates: "Nov 2016 — Mar 2017",
      role: "Web Developer Intern",
      company: "Pylon Partners Inc.",
      description: "Web development internship during my final year of college.",
    },
  ] satisfies Role[],
};

export const quotes = {
  eyebrow: "In their words",
  items: [
    { quote: "“…exceptional responsibility and thoroughness.”", attribution: "Emily Williams · LinkedIn recommendation" },
    { quote: "“…always keen to learn new technologies.”", attribution: "Justine Ballares · LinkedIn recommendation" },
  ],
};

export const contact = {
  eyebrow: "Hiring a software engineer?",
  title: "Let’s [talk.]",
  body: "Open to full-time software engineering and lead roles across web, mobile and backend. Remote or hybrid.",
  copyright: "© 2026 Joe Arlo Baltazar",
  colophon: "Designed in Figma · Built with Next.js",
};

// Chapters drive the progress rail (one dash each) and the nav's active pill.
export const chapters = [
  { id: "top", label: "Intro", nav: "about" },
  { id: "what", label: "What I do", nav: "about" },
  { id: "work", label: "Selected work", nav: "work" },
  { id: "approach", label: "How I work", nav: "approach" },
  { id: "experience", label: "Experience", nav: "experience" },
  { id: "words", label: "In their words", nav: null },
  { id: "contact", label: "Contact", nav: null },
] as const;

export const navItems = [
  { id: "about", label: "About", href: "#about" },
  { id: "work", label: "Work", href: "#work" },
  { id: "approach", label: "Approach", href: "#approach" },
  { id: "experience", label: "Experience", href: "#experience" },
] as const;
