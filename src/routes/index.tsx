import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BeforeAfterDiagram,
  CapabilityFlow,
  Constellation,
  Reveal,
  Section,
  SectionHeading,
} from "../components/manifesto";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const BRIEFING = "/docs/tim-berners-lee-briefing";
const CONTRACT = "/docs/hyperactive-web-v0.1";
const RFC_DRAFT = "/docs/draft-hyperactive-web-00";
const V02_PROFILE = "/docs/hyperactive-web-v0.2-identity-provenance";
const IDENTITY_BRIEFING = "/docs/identity-provenance-briefing";
const FIXTURES = "/conformance/v0.1/fixtures/manifest.json";

const primaryLink =
  "inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const secondaryLink =
  "inline-flex min-h-11 items-center justify-center rounded-full border hairline px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function ExternalLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {children}
      <span aria-hidden className="ml-1.5">
        ↗
      </span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden border-b hairline">
        <div className="absolute inset-0">
          <Constellation />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 38%, transparent 0%, var(--background) 76%)",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-24 sm:pb-32 sm:pt-36 lg:px-10 lg:pb-40">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border hairline bg-background/50 px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground backdrop-blur">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--accent-blue)]" />
              Normative experiment · v0.1
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="font-display mt-7 max-w-5xl text-5xl leading-[0.96] tracking-tight text-foreground sm:text-7xl lg:text-[5.5rem]">
              Let the Web say what <span className="text-gradient">can be done.</span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-8 max-w-3xl text-balance text-lg leading-relaxed text-muted-foreground sm:text-xl">
              The Web already links people, data, and services. Hyperactive Web v0.1 asks whether an
              invocable affordance can travel just as well: a typed declaration of inputs, outputs,
              protocol binding, authorization, risk, and consent cues—interpreted by software while
              authority stays with the user.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-7 inline-flex max-w-3xl items-center gap-3 rounded-xl border border-[var(--accent-violet)]/30 bg-[var(--accent-violet)]/10 px-4 py-3 text-sm leading-relaxed text-foreground/85">
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-[var(--accent-violet)]">
                v0.2 draft
              </span>
              <span>
                Identity and provenance are becoming first-class: who contributed, which model or
                tool participated, what evidence supports the claim, and what remains unknown.
              </span>
            </div>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                to="/demo"
                className={primaryLink}
                style={{ background: "var(--gradient-accent)" }}
              >
                Run the live demo{" "}
                <span aria-hidden className="ml-1.5">
                  →
                </span>
              </Link>
              <ExternalLink href={BRIEFING} className={secondaryLink}>
                Read the discussion brief
              </ExternalLink>
              <ExternalLink href={V02_PROFILE} className={secondaryLink}>
                Read the identity + provenance profile
              </ExternalLink>
              <ExternalLink href={IDENTITY_BRIEFING} className={secondaryLink}>
                Start with the HTTP example
              </ExternalLink>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <dl className="mt-14 grid max-w-3xl gap-3 sm:grid-cols-3">
              {[
                ["2", "runtime stacks"],
                ["12", "shared fixtures + vectors"],
                ["0", "standards claims"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-xl border hairline bg-background/45 px-4 py-3 backdrop-blur"
                >
                  <dt className="font-mono text-[0.67rem] uppercase tracking-[0.16em] text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="font-display mt-1 text-2xl text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <Section id="proposal">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <SectionHeading
              eyebrow="§ 01 · The proposal"
              title={<>A portable declaration of an affordance.</>}
            />
          </Reveal>
          <Reveal delay={120} className="lg:col-span-7">
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
              <p>
                Forms, HTTP methods, link relations, hypermedia controls, and software agents
                already belong to the Web. The problem is narrower: agent protocols describe
                callable tools differently, and the policy information around an action rarely
                travels with it.
              </p>
              <p>
                A <span className="text-foreground">Capability Link</span> is the v0.1 experiment: a
                typed hypermedia control that declares the action contract and a binding, then
                leaves the final authorization decision to a local runtime. It extends the Web’s
                vocabulary; it does not replace hyperlinks, browsers, HTTP, or human-readable pages.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={180} className="mt-14">
          <BeforeAfterDiagram />
        </Reveal>
      </Section>

      <Section id="contract">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <SectionHeading
              eyebrow="§ 02 · The contract"
              title={<>Small enough to inspect. Precise enough to test.</>}
            />
            <p className="mt-6 leading-relaxed text-muted-foreground">
              The declaration is ordinary JSON in v0.1. Its selected contract fields canonicalize to
              the same bytes and SHA-256 digest in Swift and TypeScript. That proves exact
              declaration equality—not semantic equivalence or provider trust.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ExternalLink href={CONTRACT} className={secondaryLink}>
                Normative contract
              </ExternalLink>
              <ExternalLink href={RFC_DRAFT} className={secondaryLink}>
                RFC-style draft
              </ExternalLink>
              <ExternalLink href={V02_PROFILE} className={secondaryLink}>
                Identity + provenance v0.2
              </ExternalLink>
              <ExternalLink href={FIXTURES} className={secondaryLink}>
                Conformance fixtures
              </ExternalLink>
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border hairline bg-card/50">
              <div className="flex items-center justify-between border-b hairline px-5 py-3">
                <span className="font-mono text-[0.67rem] uppercase tracking-[0.16em] text-muted-foreground">
                  Capability Link · v0.1
                </span>
                <span className="font-mono text-[0.67rem] text-muted-foreground">
                  application/json
                </span>
              </div>
              <pre className="overflow-x-auto p-5 text-[0.76rem] leading-6 text-foreground/85 sm:p-7 sm:text-[0.82rem]">
                <code>{`{
  "rel": "travel.searchHotels",
  "href": "a2a+https://provider.example/skills/search-hotels",
  "method": "delegate",
  "inputSchema": {
    "type": "object",
    "required": ["city"]
  },
  "outputSchema": { "type": "object" },
  "declaredRisk": "readOnly",
  "requiresConfirmation": false
}`}</code>
              </pre>
              <div className="border-t hairline bg-muted/20 px-5 py-4 text-xs leading-relaxed text-muted-foreground sm:px-7">
                The custom address and composed URI scheme are experimental. A v0.2 design should
                test ordinary HTTPS identifiers, URI-valued relations, and typed binding
                metadata—potentially through Web of Things.
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section id="flow">
        <Reveal>
          <SectionHeading
            eyebrow="§ 03 · Runtime"
            title={<>A call, with the human still in the loop.</>}
          />
          <p className="mt-6 max-w-3xl leading-relaxed text-muted-foreground">
            Discovery is not authority. The runtime validates what was declared, resolves a binding,
            evaluates local policy, pauses when consent or credentials are required, invokes through
            an adapter, and retains evidence of what occurred.
          </p>
        </Reveal>
        <Reveal delay={140} className="mt-12">
          <CapabilityFlow />
        </Reveal>
        <Reveal delay={200} className="mt-5">
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            v0.1 policy still relies partly on publisher-declared risk. Independent local
            classification and stricter limits for fan-out, retries, and caching are design
            gates—not solved problems.
          </p>
        </Reveal>
      </Section>

      <Section id="architecture">
        <Reveal>
          <SectionHeading
            eyebrow="§ 04 · Architecture"
            title={<>Built on the Web. Measured against it.</>}
          />
          <p className="mt-6 max-w-3xl leading-relaxed text-muted-foreground">
            The strongest version of this idea is a profile of existing architecture, not an island
            of new terms. These are the foundations and the questions they impose on the experiment.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: "Web Architecture",
              role: "URIs, representations, interaction",
              body: "Keep identifiers dereferenceable, preserve safe interaction semantics, and separate content, presentation, and interaction.",
              href: "https://www.w3.org/TR/webarch/",
            },
            {
              name: "Linked Data",
              role: "Identifiers and typed links",
              body: "Use HTTP URIs, return useful descriptions, and connect declarations to other things with resolvable links.",
              href: "https://www.w3.org/DesignIssues/LinkedData.html",
            },
            {
              name: "Web of Things",
              role: "Affordances and protocol bindings",
              body: "The closest prior art. v0.2 should attempt a Thing Description mapping before inventing another vocabulary.",
              href: "https://www.w3.org/TR/wot-thing-description11/",
            },
            {
              name: "Solid",
              role: "Person-controlled data and access",
              body: "Complementary infrastructure for user-held data and authorization; the Solid Protocol is a Community Group report, not a W3C standard.",
              href: "https://solidproject.org/TR/protocol",
            },
            {
              name: "HTTP + Web Linking",
              role: "Methods, status, typed relations",
              body: "Prefer ordinary HTTP targets and registered or URI-valued link relations over opaque composed schemes.",
              href: "https://www.rfc-editor.org/rfc/rfc8288.html",
            },
            {
              name: "Ethical Web Principles",
              role: "Human agency and safety",
              body: "Privacy, accessibility, internationalization, security, and user control are architecture requirements, not launch polish.",
              href: "https://www.w3.org/TR/ethical-web-principles/",
            },
          ].map((item, index) => (
            <Reveal key={item.name} delay={80 + index * 45}>
              <ExternalLink
                href={item.href}
                className="group block h-full rounded-2xl border hairline bg-card/35 p-6 transition-colors hover:bg-card/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="font-mono text-[0.65rem] uppercase tracking-[0.17em] text-muted-foreground">
                  {item.role}
                </div>
                <h3 className="font-display mt-4 text-2xl text-foreground group-hover:text-gradient">
                  {item.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </ExternalLink>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="identity">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <SectionHeading
              eyebrow="§ 05 · Identity + provenance"
              title={<>Not a badge. A chain of evidence.</>}
            />
            <p className="mt-6 leading-relaxed text-muted-foreground">
              The proposed v0.2 profile records contributions instead of guessing a single human-or-AI
              verdict. It keeps the principal, node, actor, executor, model, signer, issuer, and verifier
              distinct.
            </p>
            <ExternalLink href={V02_PROFILE} className={`${secondaryLink} mt-7`}>
              Read the formal v0.2 profile
            </ExternalLink>
            <ExternalLink href={IDENTITY_BRIEFING} className={`${secondaryLink} mt-3`}>
              Start with the ordinary HTTP example
            </ExternalLink>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-7">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Contributions", "Prompted, generated, edited, reviewed, approved, signed, and delivered roles remain visible."],
                ["Evidence", "Signed statements bind exact artifacts to credentials, model attestations, mandates, and receipts."],
                ["Verification", "Consumers report content binding, identity, participation, chronology, transparency, and lineage separately."],
                ["Honest uncertainty", "Missing or stripped provenance means unknown—not proof that something was human-made."],
              ].map(([title, body]) => (
                <div key={title} className="rounded-2xl border hairline bg-card/35 p-6">
                  <h3 className="font-display text-2xl text-foreground">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      <Section id="evidence">
        <Reveal>
          <SectionHeading
            eyebrow="§ 06 · Evidence"
            title={<>Working code, clearly separated from the hypothesis.</>}
          />
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          <Reveal delay={100}>
            <article className="h-full rounded-2xl border hairline bg-card/45 p-6 sm:p-8">
              <div className="font-mono text-[0.67rem] uppercase tracking-[0.18em] text-[var(--accent-blue)]">
                Implemented in v0.1
              </div>
              <ul className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
                {[
                  "A frozen wire contract, JSON Schemas, valid fixtures, invalid fixtures, and a canonical digest vector.",
                  "Swift and TypeScript implementations that agree on validation, canonicalization, and SHA-256 addressing.",
                  "Service Card profiles, provider resolution, confirmation and authorization gates, adapter dispatch, and provenance records.",
                  "A runnable travel workflow that exercises discovery, planning, policy interruption, payment challenge, and result rendering.",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden className="text-[var(--accent-blue)]">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>

          <Reveal delay={160}>
            <article className="h-full rounded-2xl border border-dashed hairline p-6 sm:p-8">
              <div className="font-mono text-[0.67rem] uppercase tracking-[0.18em] text-[var(--accent-violet)]">
                Open design gates
              </div>
              <ul className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
                {[
                  "Replace or profile the experimental capability address and composed protocol schemes with Web-native identification and binding metadata.",
                  "Map the contract to Web of Things, JSON-LD, and URI-valued link relations before adding vocabulary.",
                  "Classify risk independently of publisher claims and define safe behavior for retries, caching, fan-out, and partial failure.",
                  "Complete privacy, security, accessibility, internationalization, governance, and centralization reviews with real deployments.",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden className="text-[var(--accent-violet)]">
                      ○
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>

          <Reveal delay={220}>
            <article className="h-full rounded-2xl border border-dashed hairline bg-card/20 p-6 sm:p-8">
              <div className="font-mono text-[0.67rem] uppercase tracking-[0.18em] text-[var(--accent-green)]">
                Proposed in v0.2
              </div>
              <ul className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
                {[
                  "Contribution graphs distinguish human, agent, model, tool, signer, issuer, and verifier roles.",
                  "Signed statements bind exact artifacts to evidence, delegation, model identity, and declared lineage.",
                  "Verification reports separate content binding, identity, participation, chronology, and transparency checks.",
                  "Missing provenance remains unknown; the profile does not invent a human-made or AI-made verdict.",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden className="text-[var(--accent-green)]">
                      +
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        </div>

        <Reveal delay={220} className="mt-8">
          <div className="grid gap-px overflow-hidden rounded-2xl border hairline bg-[var(--hairline)] sm:grid-cols-4">
            {[
              ["Inspect", "Read the normative fields and invariants.", CONTRACT],
              ["Prove", "Review the proposed identity and provenance profile.", V02_PROFILE],
              ["Reproduce", "Run the same fixtures in both implementations.", FIXTURES],
              ["Challenge", "Review the argument and its hardest questions.", BRIEFING],
            ].map(([title, body, href]) => (
              <ExternalLink
                key={title}
                href={href}
                className="block bg-background p-6 transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              >
                <div className="font-display text-2xl text-foreground">{title}</div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </ExternalLink>
            ))}
          </div>
        </Reveal>
      </Section>

      <section
        id="questions"
        className="relative scroll-mt-24 overflow-hidden border-t hairline px-6 py-28 lg:px-10 lg:py-40"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(ellipse at 50% 80%, color-mix(in oklab, var(--accent-violet) 18%, transparent), transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-5xl">
          <Reveal>
            <div className="font-mono text-center text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
              The request is criticism, not endorsement
            </div>
            <h2 className="font-display mx-auto mt-6 max-w-4xl text-center text-4xl leading-[1.02] sm:text-6xl">
              Help decide whether this should become a profile, a mapping, or a lesson learned.
            </h2>
          </Reveal>

          <Reveal delay={120}>
            <ol className="mx-auto mt-12 grid max-w-4xl gap-3 sm:grid-cols-2">
              {[
                "Is Web of Things the correct foundation for portable agent affordances?",
                "Should the primary identity always be a dereferenceable HTTPS URI?",
                "Which policy facts belong in a portable declaration—and which must remain local?",
                "What smallest pilot could falsify the interoperability claim?",
              ].map((question, index) => (
                <li
                  key={question}
                  className="rounded-xl border hairline bg-background/50 p-5 text-sm leading-relaxed text-muted-foreground backdrop-blur"
                >
                  <span className="mr-2 font-mono text-[0.67rem] text-foreground/60">
                    0{index + 1}
                  </span>
                  {question}
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <ExternalLink href={BRIEFING} className={primaryLink}>
                Open the full briefing
              </ExternalLink>
              <ExternalLink href={CONTRACT} className={secondaryLink}>
                Inspect the contract
              </ExternalLink>
              <Link to="/demo" className={secondaryLink}>
                Try the demo{" "}
                <span aria-hidden className="ml-1.5">
                  →
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
