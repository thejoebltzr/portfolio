// Case-study pages, from the Figma frames "Story — Good Code / Overwatch / XStreamr (1440)" and their 390 versions.
// Text in [square brackets] inside a heading marks the italic span.

export type Theme = {
  accent: string; // stats, labels and highlights on dark sections
  deep: string; // stakes and lessons background; labels and stats on paper sections
  tile: string; // the project's work-tile colour, used by the "next story" card
};

export type Figure =
  | { kind: "image"; src: string; alt: string; caption: string; width: number; height: number }
  | { kind: "phones"; srcs: { src: string; alt: string }[]; caption: string };

export type Labelled = { title: string; body: string };

export type FlowStep = { label: string; sub?: string; highlight?: boolean };

export type StorySection =
  | {
      kind: "stakes";
      eyebrow: string;
      title: string;
      aside: string;
      halves: [Labelled, Labelled];
      stats: { value: string; label: string }[];
    }
  | {
      kind: "chapter";
      tone: "ink" | "paper";
      eyebrow: string;
      title: string;
      aside?: string;
      bigStat?: { value: string; text: string };
      results?: { value: string; title: string; body: string }[];
      points?: Labelled[];
      flow?: { steps: FlowStep[]; outcomes: string[] };
      figures?: Figure[];
    }
  | { kind: "gallery"; eyebrow: string; title: string; aside: string; figures: Figure[] }
  | { kind: "lessons"; eyebrow: string; title: string; cards: Labelled[] };

export type Story = {
  slug: string;
  name: string;
  theme: Theme;
  /** Short title used by the previous story's "next" card. */
  teaser: string;
  /** Who it was for, used in "Next story · …". */
  via: string;
  eyebrow: string;
  title: string;
  description: string;
  meta: { label: string; text: string }[];
  hero: Figure;
  sections: StorySection[];
  next: string;
};

const img = (src: string, alt: string, caption: string, width = 1600, height = 1000): Figure => ({
  kind: "image",
  src,
  alt,
  caption,
  width,
  height,
});

const phones = (dir: string, items: [string, string][], caption: string): Figure => ({
  kind: "phones",
  srcs: items.map(([file, alt]) => ({ src: `/stories/${dir}/mobile-${file}.png`, alt })),
  caption,
});

const goodCode: Story = {
  slug: "good-code",
  name: "Good Code",
  theme: { accent: "#7fc79a", deep: "#1f4d35", tile: "#1c1b18" },
  teaser: "A restaurant POS that can’t go down during dinner service",
  via: "Good Code at rebootthefuture",
  eyebrow: "Case study · Good Code at rebootthefuture · 2024 — now",
  title: "A restaurant POS that can’t go down during dinner service, [or get the money wrong.]",
  description:
    "Offline-first restaurant POS and back-office dashboard: payments that never double-charge, sync that doesn’t block service, and integrations that prove delivery.",
  meta: [
    { label: "Role", text: "Core engineer on both apps. I also run product at rebootthefuture." },
    { label: "Platforms", text: "Android tablet, handheld and kiosk POS. Web back-office dashboard." },
    { label: "Stack", text: "React Native · Expo · TypeScript · Supabase (Postgres + Deno) · PowerSync · XState" },
    { label: "Timeline", text: "Feb 2024 — now. POS from its first month, dashboard since mid-2025." },
  ],
  hero: img(
    "/stories/good-code/pos-05-item-modifiers.png",
    "Good Code POS item editor on an Android tablet",
    "The POS item editor: modifiers, course, dining option, discount and price adjust. Android tablet, landscape.",
    1600,
    900,
  ),
  sections: [
    {
      kind: "stakes",
      eyebrow: "The stakes",
      title: "Two halves, [one database.]",
      aside:
        "A stalled login costs table turns. A card sale recorded as declined when the terminal approved it means a guest charged twice. A report that quietly drops rows sends the wrong numbers to payroll.",
      halves: [
        {
          title: "The POS",
          body: "What servers, bartenders, cashiers and guests touch: orders, kitchen tickets, split checks, card terminals, tips, drawers and closeouts. Offline-first on Android tablets, handhelds and self-order kiosks, so service keeps going when the internet doesn’t.",
        },
        {
          title: "The dashboard",
          body: "The back office for owners and managers: menus and pricing, staff and permissions, floor plans, online ordering, reports and integrations. It also owns the database migrations shared by the POS and the kitchen display.",
        },
      ],
      stats: [
        { value: "~1,585", label: "Dashboard commits, about 28% of the repo" },
        { value: "~690", label: "POS commits, about 15%, from the repo’s first month" },
        { value: "3", label: "Form factors on one codebase: tablet, handheld and kiosk" },
      ],
    },
    {
      kind: "chapter",
      tone: "ink",
      eyebrow: "01 — Payments",
      title: "“Uncertain” is [not] “declined.”",
      aside:
        "The terminal approved a sale and the provider recorded it, but the terminal proxy answered with a communication error.",
      bigStat: {
        value: "54 → 0",
        text: "Sale attempts at 5 restaurants in 60 days ended on these codes, each one a possible double charge. They now go through a durable uncertain state, never a blind retry.",
      },
      points: [
        {
          title: "Problem",
          body: "The POS treated every communication error as a rejection. It marked the payment failed and allowed a new attempt under a fresh reference the gateway couldn’t de-duplicate.",
        },
        {
          title: "Decision",
          body: "Timeout and comms-error codes write a durable UNCERTAIN marker, then ask the terminal for the sale’s status by our own reference: a short settle, then up to 3 polls. Pre-authorisations keep their hold, and a recovered sale prints the same receipt data as a live one.",
        },
        {
          title: "Why it matters",
          body: "It’s the difference between a guest charged once and a guest charged twice. Tip adjustments got the same care: an outsized tip and a tip below the captured amount each need their own confirmation.",
        },
      ],
      flow: {
        steps: [
          { label: "Card sale" },
          { label: "Timeout or comms error" },
          { label: "UNCERTAIN", sub: "durable marker", highlight: true },
          { label: "Status check", sub: "by our reference · up to 3 polls" },
        ],
        outcomes: ["Recorded", "Confirmed not charged", "Sent to manual check"],
      },
      figures: [
        img(
          "/stories/good-code/pos-06-payment-dual-pricing.png",
          "Good Code POS payment screen with card and cash prices",
          "Payment: dual pricing (card vs cash), split, service charge and gift card.",
          1600,
          900,
        ),
      ],
    },
    {
      kind: "chapter",
      tone: "paper",
      eyebrow: "02 — Offline-first under load",
      title: "Reads [stopped waiting] behind sync.",
      aside:
        "Local SQLite synced with PowerSync keeps service running through network drops, until sync itself becomes the bottleneck.",
      bigStat: { value: "≈1 s", text: "Taken off the login screen and the order and floor views on busy restaurants." },
      points: [
        {
          title: "Problem",
          body: "PowerSync commits on the single SQLite write connection and can hold the lock for about 10 seconds on busy restaurants. Reads queued behind it.",
        },
        {
          title: "Decision",
          body: "Hot-path reads moved to the read pool, and the rule became explicit at the storage layer: reads through withRead, writes through a retry-aware single writer.",
        },
        {
          title: "Sync integrity",
          body: "A write was uploaded as the anonymous role while the offline session cache said “signed in”. The upload guard now requires a live session and never dead-letters those writes.",
        },
      ],
      figures: [
        img(
          "/stories/good-code/pos-02-offline-sync.png",
          "Good Code POS restaurant login showing offline sync progress",
          "First sign-in: PowerSync downloads about 121k operations so the station can run offline.",
          1600,
          900,
        ),
      ],
    },
    {
      kind: "chapter",
      tone: "ink",
      eyebrow: "03 — Reports and integrations",
      title: "Numbers that scale, partners that [prove delivery.]",
      aside: "External APIs lie politely: a 202 that means nothing, a row cap that never says it truncated.",
      results: [
        {
          value: "9 → 1",
          title: "Report requests",
          body: "Daily Sales chunked ticket IDs by 300, so cost grew with tickets, not rows. A tenant-scoped helper now counts first and takes the cheaper path. Earlier, I stopped report lists being cut off at PostgREST’s 1,000-row cap.",
        },
        {
          value: "2,900+",
          title: "Mappings kept",
          body: "Moving a restaurant from a 7shifts token to OAuth used to mean disconnecting and losing 2,111 receipts, 747 punches and 85 employees’ mappings. An in-place OAuth upgrade keeps them all.",
        },
        {
          value: "Outbox",
          title: "Proof of delivery",
          body: "NowBookIt answers “202 Accepted” even when it rejects a sale. A transactional outbox (pending → processing → sent → confirmed or dead) with backoff and reconciliation only counts a sale once it appears on their side.",
        },
      ],
      figures: [
        img("/stories/good-code/dashboard-03-reports.png", "Good Code dashboard reports list", "Reports, grouped, including OnePOS-style summaries."),
        img(
          "/stories/good-code/dashboard-10-integrations.png",
          "Good Code dashboard third-party integrations",
          "Integrations: 7shifts, NowBookIt, OpenTable, Nory and gift cards.",
        ),
      ],
    },
    {
      kind: "chapter",
      tone: "paper",
      eyebrow: "04 — Guardrails",
      title: "Encode the rule, [not just the fix.]",
      aside:
        "Fixes land with the rule that prevents a repeat, so the next engineer, or AI coding agent, can’t reintroduce the bug.",
      points: [
        {
          title: "Integrity sweep",
          body: "A scheduled, read-only sweep checks 7 invariants against live data, compares them to a per-environment baseline and reports drift to Sentry. It catches damage that’s already stored, not just new damage.",
        },
        {
          title: "Ratcheting CI",
          body: "Typecheck and lint drift checks fail only on new problems, so legacy code improves without blocking feature work. Preview deploys of a branch’s edge functions go to dev only.",
        },
        {
          title: "Delivery safety",
          body: "No laptop writes to staging or production; deploys go through CI and promotion. When a revert broke bundling on every PR, I traced it and fixed it without bringing the reverted code back.",
        },
      ],
    },
    {
      kind: "gallery",
      eyebrow: "Screens",
      title: "One system, from the [kitchen] to the back office.",
      aside: "Dev environment, test restaurant. Today’s figures read $0 because the business day had just started.",
      figures: [
        img("/stories/good-code/dashboard-01-home.png", "Good Code dashboard home", "Dashboard home: today’s revenue, labor and quick actions."),
        img(
          "/stories/good-code/dashboard-06-kitchen-order-routing.png",
          "Kitchen order routing settings",
          "Kitchen order routing to printers and KDS stations.",
        ),
        img("/stories/good-code/dashboard-05-receipt-designer.png", "Receipt designer with live preview", "Receipt designer with live preview."),
        img(
          "/stories/good-code/dashboard-08-online-ordering.png",
          "Online ordering setup",
          "Online ordering storefront and setup readiness.",
        ),
        img("/stories/good-code/pos-10-split-check.png", "POS split check", "Split check: evenly, by seat or by item.", 1600, 900),
        img("/stories/good-code/pos-14-server-closeout-report.png", "POS server closeout report", "Server closeout report.", 1600, 900),
      ],
    },
    {
      kind: "lessons",
      eyebrow: "What I learned",
      title: "Offline-first changes what “[correct]” means.",
      cards: [
        {
          title: "Clear rules beat case-by-case fixes",
          body: "With local SQLite, a sync engine holding locks and sessions valid offline but not online, the hard bugs are about who wrote what, and when.",
        },
        { title: "External APIs lie politely", body: "Design for proof of delivery: outboxes, reconciliation and uncertain states." },
        {
          title: "Three form factors, one behaviour",
          body: "Tablet, handheld and kiosk share hooks and the ticket state machine, so a pricing or tax fix can’t land on one and miss the others.",
        },
        {
          title: "What I’d push for next",
          body: "Contract tests for every payment and integration partner, and performance budgets on the hottest POS screens, so regressions show up in CI rather than during service.",
        },
      ],
    },
  ],
  next: "overwatch",
};

const overwatch: Story = {
  slug: "overwatch",
  name: "Overwatch",
  theme: { accent: "#f2a66b", deep: "#522819", tile: "#2a1b13" },
  teaser: "Wildfire exposure for insurers, on a phone and on the web",
  via: "Overwatch via NTERSOL",
  eyebrow: "Case study · Overwatch via NTERSOL · 2025 — now",
  title: "Which insured homes is this fire about to reach, [and how much is at stake?]",
  description:
    "Wildfire and hurricane exposure for insurers: a React Native app from the first commit, and data-correctness work on the Next.js web platform.",
  meta: [
    { label: "Role", text: "Lead mobile engineer from the first commit. Senior engineer on web data correctness." },
    { label: "Platforms", text: "iOS and Android app for insurers in the field. Next.js web platform for wildfire and hurricane." },
    { label: "Stack", text: "React Native · TypeScript · Mapbox · Auth0 · TanStack Query · Next.js · deck.gl · Playwright" },
    { label: "Timeline", text: "Mar 2025 — now. Mobile from the first commit, web since Aug 2026." },
  ],
  hero: img(
    "/stories/overwatch/web-01-wildfire-satellite-hotspots.png",
    "Overwatch web map with active fires and satellite hotspots",
    "Web: active fires with NASA FIRMS satellite hotspots, a layer I rebuilt after the upstream source went away.",
  ),
  sections: [
    {
      kind: "stakes",
      eyebrow: "The stakes",
      title: "A wrong number is [worse than no number.]",
      aside:
        "A confident but wrong exposure figure can drive a bad call on policyholders, claims or a binding moratorium. Most of the hard bugs here looked like small UI glitches.",
      halves: [
        {
          title: "The mobile app",
          body: "Every active fire next to the account’s own properties, with properties at risk and Total Insured Value over a 0–14 day spread forecast. Push alerts bring field users in when a fire threatens their portfolio.",
        },
        {
          title: "The web platform",
          body: "The desk tool for wildfire and hurricane: satellite hotspots, forecast cones, advisory timelines, selection tools and portfolio uploads. I joined a team of six-plus to make its numbers trustworthy.",
        },
      ],
      stats: [
        { value: "226 / 232", label: "Mobile commits, lead from the first one" },
        { value: "26", label: "Web fixes in five weeks, each to its root cause" },
        { value: "iOS 2.6", label: "Shipped to both stores, now on Android API 36" },
      ],
    },
    {
      kind: "chapter",
      tone: "ink",
      eyebrow: "01 — Hurricane exposure",
      title: "The table saw [a fifth] of the portfolio.",
      aside:
        "For one advisory, the Timeline said 586 properties and $460.83M. The panel right above it said 774 and $783.84M.",
      bigStat: {
        value: "20% → 100%",
        text: "The search endpoint returned at most 1,000 rows when topN was left out, and never said it truncated. With 5,035 locations, the app was scoring a sample.",
      },
      points: [
        {
          title: "Problem",
          body: "Both hurricane hooks left out topN, so each scored an arbitrary 1,000-row sample. A silent cap produced numbers that looked right and weren’t.",
        },
        {
          title: "Decision",
          body: "Read every location for the area, then make that read fast: concurrent pages with retries, a wave size that starts at one page and doubles, and a loading state that covers the whole pipeline.",
        },
        {
          title: "Why it matters",
          body: "The big advisory read went from 9 sequential round trips (about 84 s) to 4, and one-page searches stopped paying for five requests. A table still filling in no longer looks empty.",
        },
      ],
      flow: {
        steps: [
          { label: "Storm selected" },
          { label: "Union of forecast cones" },
          { label: "43,817 rows", sub: "every location", highlight: true },
          { label: "Adaptive waves", sub: "1 → 2 → 4 pages · retries" },
        ],
        outcomes: ["Panel and table agree", "Stale responses dropped", "Loading until complete"],
      },
      figures: [
        img(
          "/stories/overwatch/web-08-hurricane-advisory-timeline.png",
          "Overwatch hurricane advisory timeline",
          "Advisory timeline: exposure for every advisory, now scored against the whole portfolio.",
        ),
      ],
    },
    {
      kind: "chapter",
      tone: "paper",
      eyebrow: "02 — Field sessions",
      title: "Reopening the app [stopped crashing it.]",
      aside:
        "Field users open the app hours apart on poor connections. The Auth0 token lasted about an hour and was never renewed.",
      bigStat: {
        value: "3",
        text: "Production crash classes fixed at the root: expired-token resume, a native Keychain crash after a backend migration, and a release-only launch crash.",
      },
      points: [
        {
          title: "Problem",
          body: "Reopening after an hour sent a burst of requests that all got 401. Each one logged out and purged state mid-navigation, and the app crashed.",
        },
        {
          title: "Decision",
          body: "One deduplicated token refresh on cold start and every foreground, and one refresh-and-retry on 401 before logging out. Navigation needs a valid token, not just a stored user.",
        },
        {
          title: "Upgrade path",
          body: "A backend migration left Keychain credentials for the old Auth0 domain, which crashed login natively. A one-time wipe before Auth0 mounts fixed every existing install.",
        },
      ],
      figures: [
        phones(
          "overwatch",
          [
            ["02-map", "Portfolio map with active fires"],
            ["04-fire-detail", "Fire perimeter and nearby properties"],
            ["05-fire-forecast", "Forecast days and fire-size percentile"],
            ["06-property", "Property at risk with its TIV"],
          ],
          "Mobile: portfolio map, fire perimeter, forecast controls and a property at risk. Demo account.",
        ),
      ],
    },
    {
      kind: "chapter",
      tone: "ink",
      eyebrow: "03 — Believable but wrong",
      title: "Numbers that agree, [on every screen.]",
      aside:
        "In risk software, a plausible wrong answer is the worst failure. Most of these hid in defaults nobody had checked.",
      results: [
        {
          value: "2",
          title: "Race conditions",
          body: "A previous storm’s response could land on the new storm for 500 ms, and slow reverse geocodes overwrote newer pins. Responses are now tied to their scope and request id.",
        },
        {
          value: "3",
          title: "Lookup errors",
          body: "ZIP searches flagged fires tens of miles away, a German postcode matched Oregon, and placeholder land codes showed as ZIPs. Each now uses the right endpoint or label.",
        },
        {
          value: "FIRMS",
          title: "Hotspots restored",
          body: "The upstream GeoServer stopped publishing satellite layers and the spinner never stopped. A server route now reads NASA FIRMS’ public 48-hour feeds and shows a toast on failure.",
        },
      ],
      figures: [
        img(
          "/stories/overwatch/web-03-wildfire-exposure-forecast.png",
          "Property exposure per forecast day",
          "Property exposure per forecast day, 0 to 14.",
        ),
        img(
          "/stories/overwatch/web-07-hurricane-forecast-cone.png",
          "Hurricane track and forecast cone",
          "Storm track, forecast cone and wind field.",
        ),
      ],
    },
    {
      kind: "chapter",
      tone: "paper",
      eyebrow: "04 — Guardrails",
      title: "Tests that [prove the bug is caught.]",
      aside:
        "Every fix ships with a commit message that records the symptom, root cause, evidence and why the fix is shaped that way.",
      points: [
        {
          title: "KPI tests",
          body: "New tests assert that the count equals the number of cards shown, not just that a number appears. I broke the KPI on purpose to confirm they fail.",
        },
        {
          title: "Fewer moving parts",
          body: "The public smoke run logged in three roles before one unauthenticated test. Setup now logs in only the roles the selected Playwright projects need.",
        },
        {
          title: "Same numbers",
          body: "Mobile asks the API for precomputed fire risk, so risk count and TIV match the web. Policies stacked at one address group into one marker coloured by the highest TIV.",
        },
      ],
    },
    {
      kind: "gallery",
      eyebrow: "Screens",
      title: "One answer, [at the desk and in the field.]",
      aside: "Web: dev environment with a QA account. Mobile: demo account. No client data.",
      figures: [
        img(
          "/stories/overwatch/web-02-wildfire-overview.png",
          "Wildfire overview",
          "Wildfire outlook, fire status filters and portfolio styling by TIV.",
        ),
        img(
          "/stories/overwatch/web-04-wildfire-selection-tools.png",
          "Selection tools",
          "Selection tools: draw a selection or buffer, then score it.",
        ),
        img("/stories/overwatch/web-05-wildfire-other-layers.png", "Extra map layers", "Extra layers: structures and wildfire history."),
        img("/stories/overwatch/web-06-hurricane-storms.png", "Hurricane season storms", "Hurricane season: every storm with its exposure."),
        img(
          "/stories/overwatch/web-09-settings-portfolios.png",
          "Portfolio management",
          "Portfolio management: upload, replace and export.",
        ),
        phones(
          "overwatch",
          [
            ["03-fires-list", "Active fires sorted by TIV"],
            ["07-fire-satellite", "Satellite view"],
            ["09-notifications", "Alert settings"],
            ["11-drawer", "Account drawer"],
          ],
          "Mobile: fires sorted by TIV at risk, satellite view, alerts and the account drawer.",
        ),
      ],
    },
    {
      kind: "lessons",
      eyebrow: "What I learned",
      title: "Plausible but wrong [is the worst failure.]",
      cards: [
        {
          title: "Silent failures hide in defaults",
          body: "A missing topN, networkMode ‘online’, an image optimizer, a hard-coded host. I now check the defaults of every API and library on a data path.",
        },
        {
          title: "Design for upgrades, not fresh installs",
          body: "The worst mobile bugs hit existing users after a backend migration, from state saved in two places. Migrations now cover both before auth changes.",
        },
        {
          title: "Loading state is part of correctness",
          body: "A spinner that clears too early makes “still loading” look like “no exposure”. In this domain, that is a wrong answer.",
        },
        {
          title: "What I’d push for next",
          body: "API contracts that report truncation, a CI check for hard-coded hosts, and crash reporting plus unit tests on auth and marker grouping from day one.",
        },
      ],
    },
  ],
  next: "xstreamr",
};

const xstreamr: Story = {
  slug: "xstreamr",
  name: "XStreamr",
  theme: { accent: "#b9a8ff", deep: "#362a66", tile: "#1a1829" },
  teaser: "Two brands on one codebase, with payments the app stores approve",
  via: "XStreamr via NTERSOL",
  eyebrow: "Case study · XStreamr via NTERSOL · 2026 — now",
  title: "Fans pay creators directly, [and the app stores still approve it.]",
  description:
    "Two brands on iOS, Android and web from two codebases: store-compliant payments, API contract checks in CI, and in-place framework upgrades.",
  meta: [
    { label: "Role", text: "Lead engineer for the client platforms: iOS, Android and web." },
    { label: "Platforms", text: "Two brands, XStreamr Sports and XStreamr, on iOS, Android and web from two codebases." },
    { label: "Stack", text: "React Native 0.86 · Angular 21 · TypeScript · Stripe · Agora · Mux · AWS" },
    { label: "Timeline", text: "Sep 2026 — now. About 620 commits across both apps in eight weeks." },
  ],
  hero: img(
    "/stories/xstreamr/web-fan-athlete-profile.png",
    "XStreamr athlete profile on the web",
    "Athlete profile on the web: subscribe, request a video, tip and claim offers.",
  ),
  sections: [
    {
      kind: "stakes",
      eyebrow: "Inherited",
      title: "Two legacy apps, [one new backend.]",
      aside:
        "A hybrid mobile app and a web app tied to an old backend, both with secrets committed and outdated frameworks. Another team was writing the new API at the same time.",
      halves: [
        {
          title: "The mobile app",
          body: "React Native for fans and creators: tickets, live events, tips, subscriptions, 1:1 calls, Fan Rewards and merch with Stripe in the app. Upgraded from 0.71 to 0.86 with no feature freeze.",
        },
        {
          title: "The web app",
          body: "Angular for fans and creator tools: go live over RTMP, offers, earnings and payouts, and the Stripe Payment Element. Upgraded from Angular 14 to 21 one major version at a time.",
        },
      ],
      stats: [
        { value: "2 × 3", label: "Brands × platforms, from two codebases" },
        { value: "~620", label: "Commits across both apps in about eight weeks" },
        { value: "10", label: "iOS TestFlight builds in two weeks" },
      ],
    },
    {
      kind: "chapter",
      tone: "ink",
      eyebrow: "01 — Payments",
      title: "App store policy, [written as code.]",
      aside: "Apple and Google require their own in-app purchase for digital goods, and allow outside payment for physical goods.",
      bigStat: {
        value: "70%",
        text: "Of what fans pay goes to the creator. The payment policy had to keep the apps approvable without giving up that main revenue path.",
      },
      points: [
        {
          title: "Problem",
          body: "Store rules differ for digital and physical goods, and by region. Spread across screens, that logic is hard to review and easy to get rejected for.",
        },
        {
          title: "Decision",
          body: "One canBuyOnWeb policy decides per device region. Digital goods link out to web checkout and the app refreshes on return; merch goes through Stripe in the app. Deep links open exactly the dialog the app asked for.",
        },
        {
          title: "Why it matters",
          body: "Card data only ever enters Stripe’s PaymentSheet or Payment Element, so there is no raw card form. One wallet and points ledger serves both apps, so a merch order paid on mobile shows up in the web wallet.",
        },
      ],
      flow: {
        steps: [
          { label: "Fan buys" },
          { label: "Store build, device region" },
          { label: "canBuyOnWeb", sub: "one policy", highlight: true },
          { label: "Digital or physical?", sub: "decided once, tested" },
        ],
        outcomes: ["Web checkout", "Stripe in the app (merch)", "One shared ledger"],
      },
      figures: [
        phones(
          "xstreamr",
          [
            ["payment-merch-item", "Merch item"],
            ["payment-stripe-sheet", "Stripe PaymentSheet with a test card"],
            ["payment-stripe-success", "Payment confirmed"],
            ["payment-order-placed", "Order placed"],
          ],
          "Merch checkout on mobile: the item, Stripe PaymentSheet with a test card, confirmation and the placed order.",
        ),
      ],
    },
    {
      kind: "chapter",
      tone: "paper",
      eyebrow: "02 — Contract safety",
      title: "Contract breaks became [PR failures.]",
      aside:
        "The backend team was renaming and adding routes while we migrated to them. Without a check, a renamed endpoint only shows up as a broken screen in QA.",
      bigStat: {
        value: "0",
        text: "Unhandled API contract gaps. A scan compares every client HTTP call with the API’s real routes, and CI blocks the PR when they drift.",
      },
      points: [
        {
          title: "Problem",
          body: "A renamed route surfaced as a broken screen in QA, days after the change that caused it, on a backend still being written.",
        },
        {
          title: "Decision",
          body: "The api-scan tool runs as a CI gate. Gaps are triaged in a gaps doc, and routes the client needs go into a written backlog for the backend team instead of quiet workarounds.",
        },
        {
          title: "Protected media",
          body: "Locked content never exposes its file URL. The player gets a short-lived signed URL, refreshes it before it expires and never stores it. A 403 shows the unlock UI.",
        },
      ],
      figures: [
        img(
          "/stories/xstreamr/web-creator-go-live.png",
          "XStreamr Go Live setup on the web",
          "Go Live on the web: RTMP setup for OBS, and recordings served through signed playback URLs.",
        ),
      ],
    },
    {
      kind: "chapter",
      tone: "ink",
      eyebrow: "03 — Upgrades",
      title: "Upgraded in place, [never frozen.]",
      aside: "A new Xcode stopped building React Native 0.71, and Google Play’s target-SDK deadline was close.",
      results: [
        {
          value: "0.71 → 0.86",
          title: "React Native",
          body: "New Architecture, Hermes, React 19 and Gradle 9, upgraded across native modules, patches and CocoaPods while feature work kept shipping.",
        },
        {
          value: "14 → 21",
          title: "Angular",
          body: "One major version at a time, then a move to the esbuild application builder. The app stayed shippable at every commit.",
        },
        {
          value: "0 errors",
          title: "TypeScript baseline",
          body: "A baseline let legacy errors exist but never grow. Each fix lowered it until it reached zero, and CI now blocks new ones.",
        },
      ],
      figures: [
        img("/stories/xstreamr/web-creator-earnings.png", "Creator earnings and payouts", "Earnings and payouts in the creator tools."),
        img(
          "/stories/xstreamr/web-fan-wallet-rewards.png",
          "Wallet and Fan Rewards",
          "Wallet and Fan Rewards: one ledger across web and mobile.",
        ),
      ],
    },
    {
      kind: "chapter",
      tone: "paper",
      eyebrow: "04 — Guardrails",
      title: "Brands resolved [at build time.]",
      aside:
        "Forking per brand doubles every fix. A runtime switch ships every brand’s keys in every binary and risks cross-brand sessions.",
      points: [
        {
          title: "Build-time brands",
          body: "Virtual Metro modules, Android flavors and iOS schemes on mobile. Per-brand environments, theme flags and 16 per-brand templates on web. Sessions are keyed by brand.",
        },
        {
          title: "CI on every PR",
          body: "Type check against the baseline, tests, lint, secret scan, release bundles for both brands and the API scan. Web deploys use short-lived OIDC credentials.",
        },
        {
          title: "Uploads and sessions",
          body: "Files over 20 MB use chunked upload under the API’s 30 MB cap. Sessions moved to the Keychain, with a minimum-version gate for breaking API changes.",
        },
      ],
    },
    {
      kind: "gallery",
      eyebrow: "Screens",
      title: "Fans, creators and [the money between them.]",
      aside: "Dev environment with test accounts and Stripe test cards. No real payments.",
      figures: [
        img("/stories/xstreamr/web-landing.png", "XStreamr landing page", "Landing page."),
        img("/stories/xstreamr/web-creator-tools.png", "Creator tools", "Creator tools."),
        img("/stories/xstreamr/web-fan-live.png", "Live schedule", "Live: the next broadcast and the schedule."),
        img("/stories/xstreamr/web-payment-stripe-card.png", "Stripe Payment Element", "Stripe Payment Element with a test card."),
        phones(
          "xstreamr",
          [
            ["fan-home", "Fan home"],
            ["fan-profile", "Athlete profile"],
            ["creator-studio", "Creator Studio"],
            ["creator-earnings", "Creator earnings"],
          ],
          "Mobile: home, athlete profile, creator Studio and earnings.",
        ),
        img("/stories/xstreamr/web-fan-merch.png", "Merch store", "Merch store on the web."),
      ],
    },
    {
      kind: "lessons",
      eyebrow: "What I learned",
      title: "Write the decision down, [with a date.]",
      cards: [
        {
          title: "A contract beats more meetings",
          body: "Building on a moving backend worked because the contract was code: the scan, the gaps doc and the backlog for the backend team.",
        },
        {
          title: "Make policy one switch",
          body: "The store payment rules came from product, legal and engineering together. My part was making them one testable function, not scattered if statements.",
        },
        {
          title: "Measure before upgrading",
          body: "I can show quality and delivery numbers, but not the performance impact of the React Native upgrade, because I didn’t record a cold-start baseline first.",
        },
        {
          title: "What I’d do earlier",
          body: "End-to-end tests on the money paths in CI from day one, one formatting commit for the legacy code, and an owner and expiry date on every feature flag.",
        },
      ],
    },
  ],
  next: "good-code",
};

export const stories: Story[] = [goodCode, overwatch, xstreamr];

export const getStory = (slug: string) => stories.find((s) => s.slug === slug);
