import { useEffect, useMemo, useRef, useState } from "react";

// ---------- Primitives ----------

export function Chip({ children }: { children: React.ReactNode }) {
  return <span className="chip">{children}</span>;
}

export function Mono({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[0.92em] text-foreground/85">{children}</span>
  );
}

export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  as?: any;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setTimeout(() => el.classList.add("reveal-in"), delay);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  return (
    <Tag ref={ref as any} className={`reveal ${className}`}>
      {children}
    </Tag>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  className = "",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`max-w-3xl ${className}`}>
      {eyebrow && (
        <div className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {eyebrow}
        </div>
      )}
      <h2 className="font-display text-3xl leading-[1.05] text-foreground sm:text-5xl">
        {title}
      </h2>
    </div>
  );
}

export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 border-t hairline px-6 py-24 sm:py-32 lg:px-10 ${className}`}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

// ---------- External links ----------

const omClass =
  "font-mono text-[0.92em] text-accent-openmind underline decoration-dotted underline-offset-4 hover:opacity-80";

export function OpenMindLink() {
  return (
    <a href="https://openmind.advatar.systems" target="_blank" rel="noreferrer" className={omClass}>
      OpenMind
    </a>
  );
}

export function BrIAnLink() {
  return (
    <a href="https://brian.advatar.systems" target="_blank" rel="noreferrer" className={omClass}>
      BrIAn
    </a>
  );
}

// ---------- Constellation (hero background) ----------

export function Constellation() {
  const nodes = useMemo(() => {
    const seed = 7;
    const rng = mulberry32(seed);
    const arr: { x: number; y: number; r: number }[] = [];
    for (let i = 0; i < 38; i++) {
      arr.push({ x: rng() * 100, y: rng() * 100, r: 0.6 + rng() * 1.4 });
    }
    return arr;
  }, []);

  const human = { x: 52, y: 48 };

  const edges = useMemo(() => {
    const e: { a: number; b: number }[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d = Math.hypot(dx, dy);
        if (d < 18) e.push({ a: i, b: j });
      }
    }
    return e;
  }, [nodes]);

  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full opacity-[0.55]"
    >
      <defs>
        <radialGradient id="halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent-violet)" stopOpacity="0.35" />
          <stop offset="60%" stopColor="var(--accent-blue)" stopOpacity="0.08" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <linearGradient id="line" x1="0" x2="1">
          <stop offset="0%" stopColor="var(--accent-blue)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--accent-violet)" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <circle cx={human.x} cy={human.y} r="28" fill="url(#halo)" />
      {edges.map((e, i) => (
        <line
          key={i}
          x1={nodes[e.a].x}
          y1={nodes[e.a].y}
          x2={nodes[e.b].x}
          y2={nodes[e.b].y}
          stroke="currentColor"
          className="text-foreground/15"
          strokeWidth="0.08"
        />
      ))}
      {nodes.map((n, i) => {
        const dx = n.x - human.x;
        const dy = n.y - human.y;
        const d = Math.hypot(dx, dy);
        if (d < 32) {
          return (
            <line
              key={`hl-${i}`}
              x1={human.x}
              y1={human.y}
              x2={n.x}
              y2={n.y}
              stroke="url(#line)"
              strokeWidth="0.12"
              opacity={0.6 - d / 80}
            />
          );
        }
        return null;
      })}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={n.r * 0.35} fill="currentColor" className="text-foreground/55" />
      ))}
      <g>
        <circle cx={human.x} cy={human.y} r="2.4" fill="url(#line)" />
        <circle cx={human.x} cy={human.y} r="3.6" fill="none" stroke="url(#line)" strokeWidth="0.18">
          <animate attributeName="r" values="3.2;5.5;3.2" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.9;0.1;0.9" dur="4s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  );
}

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- Interactive: Zoom tiers ----------

const TIERS = [
  {
    label: "Overview",
    body: (
      <div className="space-y-2">
        <div className="font-display text-2xl">Atlas Cartography</div>
        <div className="text-sm text-muted-foreground">A capable service. Primary action available.</div>
      </div>
    ),
  },
  {
    label: "Summary",
    body: (
      <div className="space-y-3">
        <div className="font-display text-xl">Atlas Cartography</div>
        <ul className="space-y-1.5 text-sm">
          <li>· Render a place into a printable atlas</li>
          <li>· Resolve a route across modes of travel</li>
          <li>· Summarize a region for a brief</li>
        </ul>
      </div>
    ),
  },
  {
    label: "Detail",
    body: (
      <div className="space-y-3">
        <div className="font-display text-xl">Atlas Cartography</div>
        <div className="text-sm text-muted-foreground">
          Full catalog of capabilities, each with a declared intent, expected inputs, and a stated risk level.
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <Chip>render.atlas</Chip>
          <Chip>route.solve</Chip>
          <Chip>region.brief</Chip>
          <Chip>place.lookup</Chip>
          <Chip>tile.fetch</Chip>
        </div>
      </div>
    ),
  },
  {
    label: "Internals",
    body: (
      <div className="space-y-3 text-sm">
        <div className="font-display text-xl">Atlas Cartography</div>
        <div className="text-muted-foreground">Policy, provenance, and trust boundary.</div>
        <div className="space-y-1.5 font-mono text-[0.78rem] leading-relaxed text-foreground/85">
          <div>capability:sha256:9f2a…b4c1</div>
          <div>a2a+https://atlas.commons.example/.well-known/agent</div>
          <div className="text-muted-foreground">policy: ask-on-write · audit: retained · consent: per-action</div>
        </div>
      </div>
    ),
  },
];

export function ZoomDemo() {
  const [tier, setTier] = useState(0);
  return (
    <div className="overflow-hidden rounded-2xl border hairline bg-card/60">
      <div className="flex items-center justify-between gap-4 border-b hairline px-5 py-3">
        <div className="flex items-center gap-2">
          <Chip>service-card</Chip>
          <span className="font-mono text-[0.7rem] text-muted-foreground">
            tier {tier + 1} / 4 · {TIERS[tier].label}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setTier((t) => Math.max(0, t - 1))}
            aria-label="Zoom out"
            className="grid h-8 w-8 place-items-center rounded-md border hairline text-foreground/80 transition-colors hover:bg-accent"
          >
            −
          </button>
          <button
            onClick={() => setTier((t) => Math.min(3, t + 1))}
            aria-label="Zoom in"
            className="grid h-8 w-8 place-items-center rounded-md border hairline text-foreground/80 transition-colors hover:bg-accent"
          >
            +
          </button>
        </div>
      </div>
      <div className="grid gap-0 sm:grid-cols-[1fr_auto]">
        <div className="min-h-[210px] p-7">{TIERS[tier].body}</div>
        <div className="flex shrink-0 flex-col gap-1 border-t hairline p-3 sm:border-l sm:border-t-0">
          {TIERS.map((t, i) => (
            <button
              key={t.label}
              onClick={() => setTier(i)}
              className={`rounded-md px-3 py-2 text-left text-xs transition-colors ${
                tier === i ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="font-mono text-[0.65rem] uppercase tracking-wider">Tier {i + 1}</div>
              <div>{t.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- CTA placeholder ----------

export function PlaceholderButton({
  children,
  variant = "ghost",
}: {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
}) {
  const [done, setDone] = useState(false);
  const base = "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm transition-all";
  const styles =
    variant === "primary" ? "text-primary-foreground" : "border hairline text-foreground hover:bg-accent";
  return (
    <button
      onClick={() => {
        setDone(true);
        setTimeout(() => setDone(false), 2400);
      }}
      className={`${base} ${styles}`}
      style={variant === "primary" ? { background: "var(--gradient-accent)" } : undefined}
    >
      {done ? "Noted — the commons will hear." : children}
    </button>
  );
}

// ---------- Diagrams ----------

export function BeforeAfterDiagram() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {[
        {
          tag: "World Wide Web",
          line: "address → document",
          desc: "A link returns a page. Worst case: 404.",
          parts: ["address", "document"],
        },
        {
          tag: "Hyperactive Web",
          line: "address + intent + schema + policy → action",
          desc: "A link returns a possible action. Following it can change the world.",
          parts: ["address", "intent", "schema", "policy", "action"],
        },
      ].map((b) => (
        <div key={b.tag} className="rounded-2xl border hairline bg-card/50 p-6 sm:p-8">
          <div className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
            {b.tag}
          </div>
          <div className="mb-5 flex flex-wrap items-center gap-2">
            {b.parts.map((p, i) => (
              <span key={p} className="flex items-center gap-2">
                <Chip>{p}</Chip>
                {i < b.parts.length - 1 && <span className="text-muted-foreground">→</span>}
              </span>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{b.desc}</p>
        </div>
      ))}
    </div>
  );
}

export function HumanNodeDiagram() {
  const orbit = [
    { angle: 0, label: "atlas" },
    { angle: 45, label: "ledger" },
    { angle: 90, label: "notes" },
    { angle: 135, label: "scribe" },
    { angle: 180, label: "mail" },
    { angle: 225, label: "travel" },
    { angle: 270, label: "calendar" },
    { angle: 315, label: "research" },
  ];
  const cx = 50,
    cy = 50,
    r = 34;
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <defs>
        <linearGradient id="hg" x1="0" x2="1">
          <stop offset="0%" stopColor="var(--accent-blue)" />
          <stop offset="100%" stopColor="var(--accent-violet)" />
        </linearGradient>
        <radialGradient id="hh" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent-violet)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r="22" fill="url(#hh)" />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="currentColor"
        className="text-foreground/15"
        strokeDasharray="0.8 1.6"
        strokeWidth="0.2"
      />
      {orbit.map((o, i) => {
        const x = cx + r * Math.cos((o.angle * Math.PI) / 180);
        const y = cy + r * Math.sin((o.angle * Math.PI) / 180);
        return (
          <g key={i}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke="url(#hg)" strokeWidth="0.15" opacity="0.55" />
            <circle cx={x} cy={y} r="1.4" fill="currentColor" className="text-foreground/70" />
            <text
              x={x}
              y={y - 2.6}
              textAnchor="middle"
              className="fill-muted-foreground"
              style={{ font: "1.8px var(--font-mono)", letterSpacing: "0.04em" }}
            >
              {o.label}
            </text>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r="3.2" fill="url(#hg)" />
      <circle cx={cx} cy={cy} r="5" fill="none" stroke="url(#hg)" strokeWidth="0.25">
        <animate attributeName="r" values="4.6;7;4.6" dur="3.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0.1;0.9" dur="3.6s" repeatCount="indefinite" />
      </circle>
      <text
        x={cx}
        y={cy + 9}
        textAnchor="middle"
        className="fill-foreground"
        style={{ font: "2.1px var(--font-mono)", letterSpacing: "0.06em" }}
      >
        YOU
      </text>
      <text
        x={cx}
        y={cy + 12.5}
        textAnchor="middle"
        className="fill-accent-openmind"
        style={{ font: "1.8px var(--font-mono)", letterSpacing: "0.06em" }}
      >
        OpenMind
      </text>
    </svg>
  );
}

// ---------- Interactive: anatomy of a capability call ----------

const FLOW: { k: string; title: string; body: string; mono: string }[] = [
  {
    k: "Goal",
    title: "You state a goal",
    body: "“Find and book a refundable hotel in Stockholm.” Your node turns it into a plan — and composes the steps.",
    mono: 'plan: search → book   book.hotelID = {"$ref":"search.results.0.id"}',
  },
  {
    k: "Discover",
    title: "Discover the service",
    body: "Fetch the agent card; its skills become capabilities you can invoke. No app to install — just a well-known address.",
    mono: "GET https://atlas.example/.well-known/agent-card.json",
  },
  {
    k: "Identity",
    title: "Verify who's speaking",
    body: "The service's DNS-ID is checked before you trust it. Unverified means no trust — the claim is never taken at face value.",
    mono: "dns-id · _agent.atlas.example  →  ✓ verified",
  },
  {
    k: "Resolve",
    title: "Address the capability, not the host",
    body: "A contract address names what you want. Any provider that honors it can fulfill it — reads can come from anywhere, even cache.",
    mono: "capability:sha256:9f2a…b4c1  →  2 providers",
  },
  {
    k: "Search",
    title: "Read-only runs free",
    body: "Searching changes nothing, so it runs immediately and can be reconciled across providers or served from cache.",
    mono: "search → { Nordic Light · 1450 SEK · refundable }",
  },
  {
    k: "Confirm",
    title: "High-risk pauses for you",
    body: "Booking changes the world, so it stops at a confirmation gate. Nothing happens until you approve — by tap or by voice.",
    mono: "book · financialOrLegal  →  requireConfirmation",
  },
  {
    k: "Pay",
    title: "Pay only when asked",
    body: "A paid capability answers HTTP 402; your node authorizes within the limits you set, and the payment leaves a receipt.",
    mono: 'HTTP 402 · MPP amount="0.02"  →  paid · receipt',
  },
  {
    k: "Remembered",
    title: "Result, remembered",
    body: "The booking returns, and every step — identity, approval, receipt, invocation — is retained as provenance you can audit.",
    mono: "booked · ATLAS-7741 · workflow trace ✓",
  },
];

export function CapabilityFlow() {
  const [i, setI] = useState(0);
  const step = FLOW[i];
  return (
    <div className="rounded-2xl border hairline bg-card/50 p-5 sm:p-7">
      <div className="flex flex-wrap items-center gap-1.5">
        {FLOW.map((s, idx) => (
          <button
            key={s.k}
            onClick={() => setI(idx)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-colors ${
              idx === i ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
            style={idx === i ? { background: "var(--gradient-accent)" } : undefined}
          >
            <span className="font-mono text-[0.62rem] opacity-70">{idx + 1}</span>
            {s.k}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <div className="font-display text-2xl">{step.title}</div>
          <p className="mt-2 max-w-xl leading-relaxed text-muted-foreground">{step.body}</p>
          <div className="mt-4 rounded-lg border hairline bg-background/60 px-4 py-3 font-mono text-[0.8rem] break-all text-foreground/85">
            {step.mono}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setI((n) => Math.max(0, n - 1))}
            disabled={i === 0}
            aria-label="Previous step"
            className="grid h-9 w-9 place-items-center rounded-md border hairline text-foreground/80 transition-colors hover:bg-accent disabled:opacity-40"
          >
            −
          </button>
          <button
            onClick={() => setI((n) => Math.min(FLOW.length - 1, n + 1))}
            disabled={i === FLOW.length - 1}
            aria-label="Next step"
            className="grid h-9 w-9 place-items-center rounded-md border hairline text-foreground/80 transition-colors hover:bg-accent disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${((i + 1) / FLOW.length) * 100}%`, background: "var(--gradient-accent)" }}
        />
      </div>
    </div>
  );
}

// ---------- Orchestration diagram ----------

export function OrchestrationDiagram() {
  return (
    <div className="rounded-2xl border hairline bg-card/40 p-6">
      <div className="mb-5 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
        one plan, composed
      </div>
      <div className="flex flex-col items-center gap-2.5">
        <div className="grid w-full grid-cols-2 gap-3">
          {[
            ["search", "read-only · parallel"],
            ["weather", "read-only · parallel"],
          ].map(([t, s]) => (
            <div key={t} className="rounded-xl border hairline bg-background/60 p-3 text-center">
              <div className="font-mono text-sm text-foreground">{t}</div>
              <div className="mt-1 text-[0.7rem] text-muted-foreground">{s}</div>
            </div>
          ))}
        </div>
        <div className="font-mono text-xs text-muted-foreground">↓ join via $ref</div>
        <div className="w-full rounded-xl border hairline bg-background/60 p-3 text-center">
          <div className="font-mono text-sm text-foreground">book</div>
          <div className="mt-1 text-[0.7rem] text-muted-foreground">
            hotelID = {"{ $ref: search.results.0.id }"} · gate: confirm
          </div>
        </div>
        <div className="font-mono text-xs text-muted-foreground">↓</div>
        <div className="w-full rounded-xl border border-dashed hairline p-3 text-center">
          <div className="font-mono text-sm text-accent-openmind">retained</div>
          <div className="mt-1 text-[0.7rem] text-muted-foreground">workflow trace · receipts · approvals</div>
        </div>
      </div>
    </div>
  );
}
