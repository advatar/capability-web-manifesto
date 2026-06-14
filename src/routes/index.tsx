import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  component: ManifestoPage,
});

// ---------- Small primitives ----------

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="chip">{children}</span>;
}

function Mono({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[0.92em] text-foreground/85">{children}</span>
  );
}

function Reveal({
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

function SectionHeading({
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

function Section({
  id,
  children,
  className = "",
}: {
  id: string;
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

// ---------- Constellation (hero background) ----------

function Constellation() {
  const nodes = useMemo(() => {
    // deterministic pseudo-random nodes
    const seed = 7;
    const rng = mulberry32(seed);
    const arr: { x: number; y: number; r: number }[] = [];
    for (let i = 0; i < 38; i++) {
      arr.push({
        x: rng() * 100,
        y: rng() * 100,
        r: 0.6 + rng() * 1.4,
      });
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
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={n.r * 0.35}
          fill="currentColor"
          className="text-foreground/55"
        />
      ))}
      {/* Human node */}
      <g>
        <circle cx={human.x} cy={human.y} r="2.4" fill="url(#line)" />
        <circle
          cx={human.x}
          cy={human.y}
          r="3.6"
          fill="none"
          stroke="url(#line)"
          strokeWidth="0.18"
        >
          <animate
            attributeName="r"
            values="3.2;5.5;3.2"
            dur="4s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.9;0.1;0.9"
            dur="4s"
            repeatCount="indefinite"
          />
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

// ---------- Nav ----------

const NAV = [
  { id: "commons", label: "Commons" },
  { id: "doing", label: "Hyperlink" },
  { id: "node", label: "You" },
  { id: "today", label: "Today" },
  { id: "protocols", label: "Protocols" },
  { id: "cards", label: "Cards" },
  { id: "zoom", label: "Zoom" },
  { id: "ambient", label: "Ambient" },
  { id: "identity", label: "Identity" },
  { id: "payments", label: "Payments" },
  { id: "composable", label: "Composable" },
  { id: "society", label: "Society" },
  { id: "shift", label: "Shift" },
  { id: "glossary", label: "Glossary" },
];

function StickyNav({
  onToggleTheme,
  isDark,
}: {
  onToggleTheme: () => void;
  isDark: boolean;
}) {
  const [active, setActive] = useState<string>("");
  useEffect(() => {
    const els = NAV.map((n) => document.getElementById(n.id)).filter(
      Boolean,
    ) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b hairline bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3 lg:px-10">
        <a href="#top" className="flex items-center gap-2.5 min-w-0">
          <span
            aria-hidden
            className="h-2 w-2 rounded-full"
            style={{ background: "var(--gradient-accent)" }}
          />
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-muted-foreground">
            The Hyperactive Web
          </span>
        </a>
        <nav className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  className={`rounded-md px-2.5 py-1.5 text-xs transition-colors ${
                    active === n.id
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <button
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          className="rounded-md border hairline px-2.5 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
        >
          {isDark ? "Light" : "Dark"}
        </button>
      </div>
    </header>
  );
}

// ---------- Interactive: Zoom tiers ----------

const TIERS = [
  {
    label: "Overview",
    body: (
      <div className="space-y-2">
        <div className="font-display text-2xl">Atlas Cartography</div>
        <div className="text-sm text-muted-foreground">
          A capable service. Primary action available.
        </div>
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
          Full catalog of capabilities, each with a declared intent, expected
          inputs, and a stated risk level.
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
        <div className="text-muted-foreground">
          Policy, provenance, and trust boundary.
        </div>
        <div className="space-y-1.5 font-mono text-[0.78rem] leading-relaxed text-foreground/85">
          <div>capability:sha256:9f2a…b4c1</div>
          <div>a2a+https://atlas.commons.example/.well-known/agent</div>
          <div className="text-muted-foreground">
            policy: ask-on-write · audit: retained · consent: per-action
          </div>
        </div>
      </div>
    ),
  },
];

function ZoomDemo() {
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
                tier === i
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="font-mono text-[0.65rem] uppercase tracking-wider">
                Tier {i + 1}
              </div>
              <div>{t.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- CTA placeholder ----------

function PlaceholderButton({
  children,
  variant = "ghost",
}: {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
}) {
  const [done, setDone] = useState(false);
  const base =
    "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm transition-all";
  const styles =
    variant === "primary"
      ? "text-primary-foreground"
      : "border hairline text-foreground hover:bg-accent";
  return (
    <button
      onClick={() => {
        setDone(true);
        setTimeout(() => setDone(false), 2400);
      }}
      className={`${base} ${styles}`}
      style={
        variant === "primary"
          ? { background: "var(--gradient-accent)" }
          : undefined
      }
    >
      {done ? "Noted — the commons will hear." : children}
    </button>
  );
}

// ---------- Diagrams ----------

function BeforeAfterDiagram() {
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
        <div
          key={b.tag}
          className="rounded-2xl border hairline bg-card/50 p-6 sm:p-8"
        >
          <div className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
            {b.tag}
          </div>
          <div className="mb-5 flex flex-wrap items-center gap-2">
            {b.parts.map((p, i) => (
              <span key={p} className="flex items-center gap-2">
                <Chip>{p}</Chip>
                {i < b.parts.length - 1 && (
                  <span className="text-muted-foreground">→</span>
                )}
              </span>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{b.desc}</p>
        </div>
      ))}
    </div>
  );
}

function HumanNodeDiagram() {
  // Highlighted central node with orbit of agents.
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
            <line
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke="url(#hg)"
              strokeWidth="0.15"
              opacity="0.55"
            />
            <circle
              cx={x}
              cy={y}
              r="1.4"
              fill="currentColor"
              className="text-foreground/70"
            />
            <text
              x={x}
              y={y - 2.6}
              textAnchor="middle"
              className="fill-muted-foreground"
              style={{
                font: "1.8px var(--font-mono)",
                letterSpacing: "0.04em",
              }}
            >
              {o.label}
            </text>
          </g>
        );
      })}
      {/* You */}
      <circle cx={cx} cy={cy} r="3.2" fill="url(#hg)" />
      <circle
        cx={cx}
        cy={cy}
        r="5"
        fill="none"
        stroke="url(#hg)"
        strokeWidth="0.25"
      >
        <animate
          attributeName="r"
          values="4.6;7;4.6"
          dur="3.6s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.9;0.1;0.9"
          dur="3.6s"
          repeatCount="indefinite"
        />
      </circle>
      <text
        x={cx}
        y={cy + 9}
        textAnchor="middle"
        className="fill-foreground"
        style={{
          font: "2.1px var(--font-mono)",
          letterSpacing: "0.06em",
        }}
      >
        YOU
      </text>
      <text
        x={cx}
        y={cy + 12.5}
        textAnchor="middle"
        className="fill-accent-openmind"
        style={{
          font: "1.8px var(--font-mono)",
          letterSpacing: "0.06em",
        }}
      >
        OpenMind
      </text>
    </svg>
  );
}

// ---------- Page ----------

function ManifestoPage() {
  const [isDark, setDark] = useState(true);
  useEffect(() => {
    const initial = document.documentElement.classList.contains("dark");
    setDark(initial);
  }, []);
  const toggleTheme = () => {
    const next = !isDark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  };

  return (
    <div id="top" className="min-h-screen bg-background text-foreground">
      <StickyNav onToggleTheme={toggleTheme} isDark={isDark} />

      {/* HERO */}
      <section className="relative overflow-hidden border-b hairline">
        <div className="absolute inset-0">
          <Constellation />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 40%, transparent 0%, var(--background) 75%)",
            }}
          />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 pb-28 pt-28 sm:pt-40 lg:px-10 lg:pb-40">
          <Reveal>
            <div className="font-mono text-[0.72rem] uppercase tracking-[0.28em] text-muted-foreground">
              An open layer of the internet
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display mt-7 text-5xl leading-[0.98] tracking-tight text-foreground sm:text-7xl lg:text-[5.5rem]">
              The <span className="text-gradient">Hyperactive Web</span>
            </h1>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-8 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground sm:text-xl">
              The web was a quiet library of documents you could read. The
              Hyperactive Web is alive — a{" "}
              <span className="text-foreground">buzz</span> of agents discovering,
              invoking, and paying each other across the network. The order is
              yours: you keep it through your own node — one that remembers for
              you, acts on your behalf, and answers only to you.
            </p>
          </Reveal>
          <Reveal delay={260}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href="#commons"
                className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm text-primary-foreground transition-transform hover:scale-[1.02]"
                style={{ background: "var(--gradient-accent)" }}
              >
                Read the thesis
              </a>
              <PlaceholderButton>Run a node</PlaceholderButton>
            </div>
          </Reveal>
          <Reveal delay={360}>
            <div className="mt-16 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
              <span>v0.1 · draft</span>
              <span className="h-1 w-1 rounded-full bg-foreground/30" />
              <span>a commons</span>
              <span className="h-1 w-1 rounded-full bg-foreground/30" />
              <span>no gatekeeper</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2 — COMMONS */}
      <Section id="commons">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <SectionHeading
              eyebrow="§ 01 · Commons"
              title={<>Open, like the web itself.</>}
            />
          </Reveal>
          <Reveal delay={120} className="lg:col-span-7">
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
              <p>
                The Web and the InterPlanetary File System were never owned.
                They were open protocols anyone could speak. The Hyperactive Web
                is meant the same way —{" "}
                <span className="text-foreground">a public layer, not a platform.</span>
              </p>
              <p>
                No gatekeeper decides who participates. Anyone can publish a
                capability, run a node, or represent themselves. Products will
                be built on top of it; the layer underneath belongs to
                everyone.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* 3 — FROM READING TO DOING */}
      <Section id="doing">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <SectionHeading
              eyebrow="§ 02 · The link"
              title={<>The hyperlink grew up.</>}
            />
          </Reveal>
          <Reveal delay={120} className="lg:col-span-7">
            <p className="text-lg leading-relaxed text-muted-foreground">
              On the old web, a link is an address that returns a document; its
              worst case is a 404. The new primitive — the{" "}
              <span className="text-foreground">capability link</span> — is an
              address plus an intent, a schema, and a policy. It returns a
              possible action, and following it can change the world.
            </p>
          </Reveal>
        </div>
        <Reveal delay={200} className="mt-14">
          <BeforeAfterDiagram />
        </Reveal>
      </Section>

      {/* 4 — YOU ARE A NODE */}
      <Section id="node" className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px max-w-[60%]"
          style={{ background: "var(--gradient-accent)", opacity: 0.5 }}
        />
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
              § 03 · The human, restored
            </div>
            <h2 className="font-display text-4xl leading-[1.02] sm:text-6xl">
              You are not the audience.
              <br />
              You are <span className="text-gradient">a node</span>.
            </h2>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <p className="mx-auto mt-10 max-w-3xl text-balance text-center text-lg leading-relaxed text-muted-foreground">
            When intelligence is everywhere, the danger is that the human
            becomes a spectator — querying a cloud that doesn't know them. The
            Hyperactive Web answers this directly:{" "}
            <span className="text-foreground">
              every person is represented by a personal node in the society of
              agents.
            </span>{" "}
            That node carries your memory — everything your agents have seen,
            said, retrieved, and done — and it speaks and acts for you, within
            boundaries you set. It is your standing self in the web:
            persistent, sovereign, and accountable to you alone.
          </p>
        </Reveal>

        <div className="mt-20 grid gap-10 lg:grid-cols-12 lg:items-center">
          <Reveal delay={200} className="lg:col-span-5">
            <div className="aspect-square w-full text-foreground">
              <HumanNodeDiagram />
            </div>
          </Reveal>
          <Reveal delay={260} className="lg:col-span-7">
            <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
              {[
                {
                  k: "Represented",
                  v: "A node that is unmistakably you, with its own identity, among all the others.",
                },
                {
                  k: "Remembered",
                  v: "Your node holds your durable memory and the provenance of everything done in your name. Nothing important lives only in a fleeting prompt.",
                },
                {
                  k: "Sovereign",
                  v: "Your node enforces your consent: it delegates what you allow, asks before consequential actions, and answers to you.",
                },
              ].map((c) => (
                <div
                  key={c.k}
                  className="rounded-2xl border hairline bg-card/50 p-6 transition-colors hover:bg-card/80"
                >
                  <div className="font-display text-2xl">{c.k}.</div>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">
                    {c.v}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={300}>
          <p className="mx-auto mt-14 max-w-2xl text-center text-sm text-muted-foreground">
            Your node speaks <span className="font-mono text-[0.92em] text-accent-openmind">OpenMind</span> — the open protocol of memory, identity, and
            provenance. It is how your node remembers, proves what was done in your name, and stays portably yours across every service. The role is open and the memory is yours; <span className="font-mono text-[0.92em] text-accent-openmind">OpenMind</span> is the shared
            language that makes it possible.
          </p>
        </Reveal>
      </Section>

      {/* 5 — IT ALREADY RUNS */}
      <Section id="today">
        <Reveal>
          <SectionHeading
            eyebrow="§ 04 · No new internet"
            title={<>A new representation, on the web you have.</>}
          />
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {[
            {
              t: "A new media type, not a new picture.",
              d: "Images and video are passive — they render the same forever. A capability surface is active hypermedia: its content is actions you can take. Its ancestor is HTML, not JPEG.",
            },
            {
              t: "Same URL, two faces.",
              d: "Through content negotiation, one address can return a human web page or a machine-readable capability card depending on what asks for it.",
            },
            {
              t: "Discoverable today.",
              d: "Services publish a card at a well-known address, and ordinary pages can advertise their capability layer with a simple link relation. A normal browser can already fetch it.",
            },
            {
              t: "Addresses that compose.",
              d: "Capability addresses ride on plain HTTPS, so every CDN, proxy, and firewall already understands them. The browser shows the page; an agent runtime follows the actions.",
            },
          ].map((c, i) => (
            <Reveal key={c.t} delay={i * 80}>
              <article className="h-full rounded-2xl border hairline bg-card/40 p-7">
                <div className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-display text-2xl">{c.t}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {c.d}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 6 — PROTOCOLS */}
      <Section id="protocols">
        <Reveal>
          <SectionHeading
            eyebrow="§ 05 · The protocols, one fabric"
            title={<>The protocols.</>}
          />
        </Reveal>

        <div className="mt-14 overflow-hidden rounded-2xl border hairline">
          {[
            {
              k: "A2A",
              t: "Discovery and delegation.",
              d: "How services and agents introduce themselves and hand off work; an agent's card is its homepage.",
            },
            {
              k: "MCP",
              t: "The substrate.",
              d: "The substrate of tools and resources an agent draws on.",
            },
            {
              k: "A2UI",
              t: "The surfaces.",
              d: "Safe, native, agent-generated interfaces rendered across platforms without running arbitrary code.",
            },
            {
              k: "OpenMind",
              t: "Memory, identity, and provenance.",
              d: "The open protocol by which a node remembers everything it has seen, said, retrieved, and done; proves what happened; and carries a portable, durable self across services. It is what lets a personal node represent a human: persistent memory under the person's control, with an auditable trail behind every action.",
            },
            {
              k: "Capability Links",
              t: "The connective tissue.",
              d: "Typed, policy-aware links that bind discovery, tools, surfaces, and memory into something you can navigate.",
            },
          ].map((p, i) => (
            <Reveal key={p.k} delay={i * 80}>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-6 border-b hairline px-6 py-7 last:border-b-0 sm:grid-cols-[160px_1fr_auto] sm:items-baseline sm:px-10">
                <div className={`font-mono text-sm tracking-wide ${p.k === "OpenMind" ? "text-accent-openmind" : "text-gradient"}`}>
                  {p.k}
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <div className="font-display text-2xl">{p.t}</div>
                  <p className="mt-2 max-w-2xl text-muted-foreground">{p.d}</p>
                </div>
                <div className="hidden font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground sm:block">
                  layer 0{i + 1}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="mt-8 max-w-2xl text-balance text-sm text-muted-foreground">
            A2A is the etiquette, MCP the materials, A2UI the workspace, OpenMind the memory — and the self that remembers. Capability links are the contracts that bind them.
          </p>
        </Reveal>
      </Section>

      {/* 7 — CARDS & BUTTONS */}
      <Section id="cards">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <SectionHeading
              eyebrow="§ 06 · Lineage"
              title={<>Before the web, there was HyperCard.</>}
            />
          </Reveal>
          <Reveal delay={120} className="lg:col-span-7">
            <p className="text-lg leading-relaxed text-muted-foreground">
              Decades ago, HyperCard gave us cards connected by buttons that
              didn't just navigate — they{" "}
              <span className="text-foreground">did things</span>. The document
              web kept the link and dropped the button. The Hyperactive Web
              restores it: a service card is a card; a capability link is a
              button that acts — now networked, governed, and self-describing.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* 8 — ZOOM */}
      <Section id="zoom">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          <Reveal className="lg:col-span-5">
            <SectionHeading
              eyebrow="§ 07 · Steering"
              title={<>Your node drives. You zoom in to steer.</>}
            />
            <p className="mt-7 max-w-md leading-relaxed text-muted-foreground">
              Most of the time your node works on your behalf and hands you off
              between services. When you want control, you zoom in — not visual
              scale, but meaning. A compact node becomes primary actions, then
              the full catalog, then the policy and provenance underneath.
              Progressive disclosure as a steering dial, always within your
              reach.
            </p>
          </Reveal>
          <Reveal delay={160} className="lg:col-span-7">
            <ZoomDemo />
            <p className="mt-4 text-center font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
              Try the +/− controls
            </p>
          </Reveal>
        </div>
      </Section>

      {/* 9 — AMBIENT */}
      <Section id="ambient">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <SectionHeading
              eyebrow="§ 08 · Ambient"
              title={<>Ask for the capability, not the computer.</>}
            />
          </Reveal>
          <Reveal delay={120} className="lg:col-span-7">
            <p className="text-lg leading-relaxed text-muted-foreground">
              Just as content-addressed storage dissolved a file's location,
              contract-addressing dissolves a capability's location. A
              capability is identified by what it{" "}
              <span className="text-foreground">promises</span> — its intent,
              schema, and risk — as a name, not a server. Any provider that
              honors the contract can fulfill it; read-only answers can come
              from anywhere, even from cache, while actions that change the
              world stay exactly-once. Intelligence becomes ambient — and your
              node is how you reach into it on your terms.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border hairline bg-card/40 p-4">
                <div className="mb-1 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                  contract address
                </div>
                <div className="font-mono text-[0.85rem] break-all text-foreground/85">
                  capability:sha256:9f2a…b4c1
                </div>
              </div>
              <div className="rounded-xl border hairline bg-card/40 p-4">
                <div className="mb-1 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                  agent endpoint
                </div>
                <div className="font-mono text-[0.85rem] break-all text-foreground/85">
                  a2a+https://atlas.commons.example
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* 09 — IDENTITY */}
      <Section id="identity">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <SectionHeading
              eyebrow="§ 09 · Identity"
              title={<>Who is speaking? Verifiable identity.</>}
            />
          </Reveal>
          <Reveal delay={120} className="lg:col-span-7">
            <p className="text-lg leading-relaxed text-muted-foreground">
              The web gave us addresses and links but never a native way to{" "}
              <span className="text-foreground">prove who is on the other end</span>
              , and never a way to pay. The Hyperactive Web adds those two missing
              layers. Identity is anchored in DNS — the same root of trust that
              already names the web — via the emerging{" "}
              <a
                href="https://datatracker.ietf.org/doc/draft-ihsanullah-dnsid/"
                target="_blank"
                rel="noreferrer"
                className="text-foreground underline decoration-dotted underline-offset-4 hover:text-foreground/80"
              >
                DNS-ID
              </a>{" "}
              standard, so a node's name is verifiable rather than merely
              asserted. Your personal node carries a sovereign, portable
              identity; services prove who they are before you trust a
              capability; and every capability link is bound to a named principal
              you can check. Where DNS-ID isn't yet in place, today's node-issued
              keys stand in as a shim — same shape, swappable underneath.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border hairline bg-card/40 p-4">
                <div className="mb-1 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                  agent identity
                </div>
                <div className="font-mono text-[0.85rem] break-all text-foreground/85">
                  dns-id · _agent.atlas.example
                </div>
              </div>
              <div className="rounded-xl border hairline bg-card/40 p-4">
                <div className="mb-1 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                  personal node · shim
                </div>
                <div className="font-mono text-[0.85rem] break-all text-foreground/85">
                  node-key · openmind:self
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* 10 — PAYMENTS */}
      <Section id="payments">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <SectionHeading
              eyebrow="§ 10 · Economy"
              title={<>Capabilities aren't all free.</>}
            />
          </Reveal>
          <Reveal delay={120} className="lg:col-span-7">
            <p className="text-lg leading-relaxed text-muted-foreground">
              Some capabilities cost money — data, compute, a booking fee. The
              hyperactive web revives HTTP's dormant{" "}
              <span className="text-foreground">402 Payment Required</span>: a
              provider answers a paid request with a payment challenge, your node
              authorizes through a wallet or a shared payment token, and the
              request is retried with proof. It is payment-agnostic — stablecoins
              or ordinary cards — and it is{" "}
              <span className="text-foreground">just another gate</span>: nothing
              is delivered until you authorize, and every payment leaves a
              retained receipt. Because price lives with the provider, not the
              capability, many providers can offer the same contract at different
              prices — resolution becomes a market, and your node spends only
              within the limits you set.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border hairline bg-card/40 p-4">
                <div className="mb-1 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                  402 challenge
                </div>
                <div className="font-mono text-[0.85rem] break-all text-foreground/85">
                  MPP amount="0.02" currency="usd"
                </div>
              </div>
              <div className="rounded-xl border hairline bg-card/40 p-4">
                <div className="mb-1 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                  retained receipt
                </div>
                <div className="font-mono text-[0.85rem] break-all text-foreground/85">
                  paid · 0.02 USD · rail=card
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* 10b — COMPOSABLE */}
      <Section id="composable">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <SectionHeading
              eyebrow="§ 11 · Composable"
              title={<>Capabilities call each other like functions.</>}
            />
          </Reveal>
          <Reveal delay={120} className="lg:col-span-7">
            <p className="text-lg leading-relaxed text-muted-foreground">
              The base protocols are real but{" "}
              <span className="text-foreground">siloed</span> — MCP tools don't
              know about A2A agents, neither renders through A2UI without bespoke
              glue, and today's agent stacks are hand-wired one orchestration at a
              time. The Hyperactive Web is the layer that makes them{" "}
              <span className="text-foreground">compose</span>. A contract address
              names what is wanted, so any provider on any protocol can satisfy
              it; a capability link carries the schema and risk, so one
              capability's output flows into the next without custom plumbing; and
              affordances let a result advertise its own valid next actions, so
              flows assemble themselves instead of being scripted. It borrows the
              composability of smart contracts, the addressing of IPFS, and the
              etiquette of the web — but for capabilities, and governed.
            </p>
            <div className="mt-8 rounded-xl border hairline bg-card/40 p-4">
              <div className="mb-1 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                composition
              </div>
              <div className="font-mono text-[0.85rem] break-all text-foreground/85">
                search → premium-rates → book → confirm
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* 11 — SOCIETY */}
      <Section id="society">
        <Reveal>
          <figure className="mx-auto max-w-4xl text-center">
            <blockquote className="font-display text-2xl leading-[1.25] text-foreground sm:text-4xl">
              "The power of intelligence stems from our vast diversity, not
              from any single, perfect form."
            </blockquote>
            <figcaption className="mt-5 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
              Marvin Minsky · The Society of Mind
            </figcaption>
          </figure>
        </Reveal>

        <div className="mt-20 grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <SectionHeading
              eyebrow="§ 12 · Governed"
              title={<>Not emergent magic. Governed — in your favor.</>}
            />
          </Reveal>
          <Reveal delay={120} className="lg:col-span-7">
            <p className="text-lg leading-relaxed text-muted-foreground">
              This is a society of many specialized, capable agents — but a
              society with a constitution, and you are a{" "}
              <span className="text-foreground">citizen</span> of it, not its
              subject. Every consequential action carries a declared risk, a
              locally enforced verdict, and a retained, auditable trail of what
              happened and who approved it. You own your memory; you can see
              why anything was done; you can reverse what should be reversible.
              Trust comes not because intelligence appears from nowhere, but
              because every action is explicit, accountable, and answerable to
              a human node. That retained, auditable trail is not an afterthought — it is <span className="font-mono text-[0.92em] text-accent-openmind">OpenMind</span> doing its work: every action remembered, attributable, and answerable to a human node.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* 11 — SHIFT TABLE */}
      <Section id="shift">
        <Reveal>
          <SectionHeading
            eyebrow="§ 13 · At a glance"
            title={<>Web → Hyperactive Web.</>}
          />
        </Reveal>
        <Reveal delay={140}>
          <div className="mt-12 overflow-hidden rounded-2xl border hairline">
            <table className="w-full border-collapse text-left text-sm sm:text-base">
              <thead>
                <tr className="border-b hairline bg-muted/40">
                  <th className="px-4 py-4 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground sm:px-6">
                    World Wide Web
                  </th>
                  <th className="px-4 py-4 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground sm:px-6">
                    Hyperactive Web
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Transport: HTTP", "Transport: A2A / MCP / open protocols"],
                  ["Address: URL", "Address: capability / service name"],
                  [
                    "Link: hyperlink → a document",
                    "Link: capability link → an action",
                  ],
                  ["Node: web page", "Node: service card"],
                  ["Renderer: the browser", "Renderer: a zoomable surface"],
                  [
                    "You: a user at a browser",
                    "You: a node in the society, represented and remembered",
                  ],
                  [
                    "Identity: none / ad-hoc logins",
                    "Identity: DNS-anchored (DNS-ID)",
                  ],
                  [
                    "Payment: free to read",
                    "Payment: pay-per-capability (402 / MPP)",
                  ],
                  [
                    "Composition: bespoke glue per integration",
                    "Composition: capabilities compose like functions",
                  ],
                  [
                    "Memory: none — documents are stateless",
                    "Memory: OpenMind — a durable, portable ledger held by each node",
                  ],
                  ["Verb: read", "Verb: do"],
                ].map(([a, b], i, arr) => (
                  <tr
                    key={i}
                    className={
                      i < arr.length - 1
                        ? "border-b hairline"
                        : ""
                    }
                  >
                    <td className="px-4 py-4 text-muted-foreground sm:px-6">
                      {a}
                    </td>
                    <td className="px-4 py-4 text-foreground sm:px-6">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </Section>

      {/* 12 — GLOSSARY */}
      <Section id="glossary">
        <Reveal>
          <SectionHeading
            eyebrow="§ 14 · Vocabulary"
            title={<>Glossary.</>}
          />
        </Reveal>
        <Reveal delay={140}>
          <dl className="mt-12 grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {[
              [
                "Capability",
                "A specific thing a service can do, under a declared contract.",
              ],
              [
                "Capability Link",
                "The typed, policy-aware successor to the hyperlink.",
              ],
              [
                "Affordance",
                "A capability link offered in a specific state; the next valid action.",
              ],
              ["Surface", "A dynamic, zoomable interaction state."],
              [
                "Service Card",
                "The public, self-describing entry point of a service.",
              ],
              [
                "Personal Node",
                "The agent node that represents a human: their memory, identity, and consent.",
              ],
              [
                "Registry",
                "The public square where services advertise their capabilities.",
              ],
              [
                "OpenMind",
                "The open protocol of memory, identity, and provenance; how a personal node remembers, proves what was done, and carries a portable self.",
              ],
              [
                "DNS-ID",
                "DNS-anchored, verifiable identity for agents and nodes; today's node keys shim it until it is universal.",
              ],
              [
                "402 / MPP",
                "Payment as a gate: a paid capability is delivered only after your node authorizes, leaving a retained receipt.",
              ],
              [
                "Composability",
                "Capabilities call each other like functions across vendors and protocols — flows assemble themselves instead of being hand-wired.",
              ],
            ].map(([term, def]) => (
              <div
                key={term}
                className="flex flex-col gap-2 border-t hairline pt-5"
              >
                <dt>
                  <Chip>{term}</Chip>
                </dt>
                <dd className="text-[0.95rem] leading-relaxed text-muted-foreground">
                  {def}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Section>

      {/* 13 — CLOSING */}
      <section className="relative overflow-hidden border-t hairline px-6 py-32 lg:px-10 lg:py-44">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(ellipse at 50% 80%, color-mix(in oklab, var(--accent-violet) 18%, transparent), transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <Reveal>
            <h2 className="font-display text-3xl leading-[1.05] sm:text-5xl lg:text-6xl">
              The web let us reach the world's documents. The Hyperactive Web
              lets us reach the world's{" "}
              <span className="text-gradient">capabilities</span> — and gives
              each of us a node within it: represented, remembered, in control.
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mx-auto mt-10 max-w-xl text-muted-foreground">
              This layer is open. Read it, build on it, run a node.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <PlaceholderButton variant="primary">
                Run a node
              </PlaceholderButton>
              <PlaceholderButton>Publish a capability</PlaceholderButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t hairline px-6 py-10 lg:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--gradient-accent)" }}
            />
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em]">
              The Hyperactive Web
            </span>
          </div>
          <div className="italic">
            An open web of capabilities, with a place in it for you.
          </div>
          <div className="text-xs">
            Products will be built on this commons. The commons is for
            everyone.
          </div>
        </div>
      </footer>
    </div>
  );
}
