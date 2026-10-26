import { createFileRoute } from "@tanstack/react-router";
import { Mono, Reveal, Section, SectionHeading } from "../components/manifesto";

export const Route = createFileRoute("/x403")({
  component: X403Page,
  head: () => ({
    meta: [
      { title: "x403 — The Doorkeeper Protocol · The Hyperactive Web" },
      {
        name: "description",
        content:
          "x403 upgrades HTTP 403 Forbidden into a signed counter-offer: advertise capabilities instead of documents, compose x401 identity and x402 payment as declared gates, and license what leaves.",
      },
    ],
  }),
});

function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-2xl border hairline bg-card/40 p-6 font-mono text-[0.8rem] leading-relaxed text-muted-foreground">
      <code>{children}</code>
    </pre>
  );
}

const TRIAD = [
  {
    code: "401",
    name: "x401",
    by: "Proof",
    q: "Who are you, and what can you prove?",
    d: "Verifiable credentials over HTTP. A wallet answers a PROOF-REQUEST requirement with a selective-disclosure presentation in PROOF-RESPONSE — prove you're a licensed organization without revealing anything else.",
  },
  {
    code: "402",
    name: "x402",
    by: "Coinbase / x402 Foundation",
    q: "How do you pay?",
    d: "Stablecoin payments over HTTP. A signed PAYMENT-SIGNATURE payload settles in ~200ms against a PAYMENT-REQUIRED challenge — no accounts, no API keys, no subscriptions.",
  },
  {
    code: "403",
    name: "x403",
    by: "The Hyperactive Web",
    q: "What may you do here, and on what terms?",
    d: "The doorkeeper. Instead of the bytes, a signed offer of capability links — each declaring its proof requirement, its price, and its usage license, satisfiable in a single retry.",
  },
] as const;

const OFFER_EXAMPLE = `GET /research/reports/2026-q2
        ↓
HTTP/1.1 403 Forbidden
CAPABILITY-REQUIRED: <base64url offer>

{
  "scheme": "x403",
  "resource": "/research/reports/2026-q2",
  "reason": "guarded_corpus",
  "nonce": "d8kQz2L7SQ…",
  "offers": [{
    "rel": "corpus.ask",
    "title": "Ask a question against the Q2 corpus",
    "href": "x403+https://knowledge.example.com/gate/q2/ask",
    "inputSchema": { "question": "string" },
    "declaredRisk": "read_only",
    "gates": [
      { "scheme": "x401", "payload": { …verbatim proof challenge… } },
      { "scheme": "x402", "payload": { …verbatim payment terms… } },
      { "scheme": "grant", "terms": {
          "scope": ["answer.display", "answer.cache"],
          "training": "prohibited",
          "attribution": "required"
      } }
    ]
  }]
}`;

const INVOKE_EXAMPLE = `POST /gate/q2/ask
CAPABILITY-INVOCATION: <base64url>
{ "rel": "corpus.ask",
  "nonce": "d8kQz2L7SQ…",
  "fulfillments": [
    { "scheme": "x401", "payload": <verifiable presentation> },
    { "scheme": "x402", "payload": <signed payment> },
    { "scheme": "grant", "accepted": true } ] }

{ "question": "What did the report conclude about
               Nordic battery-storage margins?" }
        ↓
HTTP/1.1 200 OK
CAPABILITY-RESPONSE: <base64url>
{ "grant": <signed usage grant>,
  "receipts": { "x402": { "txHash": "0x…" },
                "provenance": "receipt:…" },
  "affordances": [ { "rel": "corpus.followup", … } ] }

{ "answer": "…", "citations": [ … ] }`;

const ECONOMICS = [
  { k: "Marginal cost of extraction", a: "~ 0", b: "price × invocations" },
  { k: "Extractor identity", a: "an anonymous user-agent string", b: "cryptographically proven" },
  { k: "What leaves the origin", a: "the corpus", b: "derived answers, under license" },
  { k: "Bulk exfiltration", a: "one crawl", b: "metered, attributable, revocable" },
  { k: "Well-behaved agents", a: "blocked with the bots", b: "first-class customers" },
] as const;

const SECURITY = [
  {
    t: "One nonce binds every gate.",
    d: "The offer carries a single challenge nonce that the proof and the payment must both bind — a valid presentation from one interaction cannot be spliced onto a fresh payment in another.",
  },
  {
    t: "Prove first, settle last.",
    d: "Payment settles only after every other gate has verified, so a failed proof never costs money — and nothing is delivered before settlement confirms.",
  },
  {
    t: "A budget against a thousand questions.",
    d: "A question-answering gate leaks the corpus one answer at a time if unmetered. The doorkeeper keeps a per-identity disclosure budget — sybil-resistant because identities are credential-backed, and expensive because every question is paid.",
  },
  {
    t: "The doorkeeper is an agent — hardened like one.",
    d: "Prices, proof requirements, and budgets live outside the model as enforced configuration. The model may negotiate terms; gate verification is deterministic code. Declared versus enforced, on the provider side this time.",
  },
] as const;

function X403Page() {
  return (
    <>
      {/* HERO */}
      <Section id="doorkeeper">
        <Reveal>
          <div className="font-mono text-[0.72rem] uppercase tracking-[0.28em] text-muted-foreground">
            Protocol draft · 0.1.0
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="font-display mt-7 max-w-4xl text-5xl leading-[1.02] tracking-tight sm:text-6xl">
            <span className="text-gradient">x403</span> — the Doorkeeper Protocol
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-8 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground sm:text-xl">
            HTTP 403 means <span className="text-foreground">Forbidden</span>: "I understood
            the request, and the answer is no." x403 upgrades the no into a counter-offer —{" "}
            <span className="text-foreground">
              you may not have the bytes, but here is what you may do.
            </span>
          </p>
        </Reveal>
      </Section>

      {/* THE PROBLEM */}
      <Section id="problem">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <SectionHeading
              eyebrow="§ 01 · The losing position"
              title={<>The scrapeable web gives your knowledge away.</>}
            />
          </Reveal>
          <Reveal delay={120} className="lg:col-span-7">
            <p className="text-lg leading-relaxed text-muted-foreground">
              The document web's contract is: publish pages, and anyone — human or bot — may
              read them. In the agent era that contract transfers your proprietary knowledge
              to whoever crawls fastest, and <Mono>robots.txt</Mono> is an honor-system sign,
              not a lock. The defensive endpoint of that road is paywalls and CAPTCHAs — which
              lock out exactly the well-behaved agents you <em>want</em> as customers.
            </p>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              The Hyperactive Web takes the opposite stance:{" "}
              <span className="text-foreground">
                don't publish the corpus; publish the doorkeeper.
              </span>{" "}
              Knowledge stays behind an agentic gate that never serves raw documents. What it
              serves is capabilities — <Mono>ask</Mono>, <Mono>summarize</Mono>,{" "}
              <Mono>verify</Mono>, <Mono>excerpt</Mono> — each priced, identity-gated, and
              licensed. The knowledge is exercised on the owner's side of the wall; only
              answers cross it, bound to a proven identity and a signed usage grant.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 overflow-hidden rounded-2xl border hairline">
          <div className="grid grid-cols-[minmax(0,1.2fr)_1fr_1fr] gap-4 border-b hairline bg-card/40 px-6 py-4 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground sm:px-8">
            <div />
            <div>Scrapeable page</div>
            <div className="text-foreground">x403 doorkeeper</div>
          </div>
          {ECONOMICS.map((r, i) => (
            <Reveal key={r.k} delay={i * 60}>
              <div className="grid grid-cols-[minmax(0,1.2fr)_1fr_1fr] gap-4 border-b hairline px-6 py-4 text-sm last:border-b-0 sm:px-8">
                <div className="text-muted-foreground">{r.k}</div>
                <div className="text-muted-foreground/70">{r.a}</div>
                <div className="text-foreground">{r.b}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* THE TRIAD */}
      <Section id="triad">
        <Reveal>
          <SectionHeading
            eyebrow="§ 02 · Three codes, one door"
            title={<>The status codes grow up together.</>}
          />
        </Reveal>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {TRIAD.map((p, i) => (
            <Reveal key={p.code} delay={i * 100}>
              <article
                className={`h-full rounded-2xl border hairline p-7 ${p.code === "403" ? "bg-card/70" : "bg-card/40"}`}
              >
                <div className="flex items-baseline justify-between">
                  <div className="font-mono text-3xl text-gradient">{p.code}</div>
                  <div className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
                    {p.by}
                  </div>
                </div>
                <h3 className="font-display mt-4 text-2xl">{p.name}</h3>
                <p className="mt-2 text-sm italic text-muted-foreground">{p.q}</p>
                <p className="mt-4 leading-relaxed text-muted-foreground">{p.d}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delay={220}>
          <p className="mt-8 max-w-3xl text-balance text-muted-foreground">
            x403 is deliberately a <span className="text-foreground">composition envelope,
            not a replacement</span>. It never re-encodes proof or payment: a gate of scheme{" "}
            <Mono>x401</Mono> embeds a verbatim x401 challenge; a gate of scheme{" "}
            <Mono>x402</Mono> embeds verbatim x402 payment terms. Wallets and facilitators
            that already speak those protocols work unchanged — x403 just moves the
            challenges forward in time, from sequential surprises into one declared offer,
            satisfied in a single retry.
          </p>
        </Reveal>
      </Section>

      {/* THE WIRE */}
      <Section id="wire">
        <Reveal>
          <SectionHeading
            eyebrow="§ 03 · The wire"
            title={<>An offer, an invocation, a grant.</>}
          />
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div>
              <div className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
                1 · The doorkeeper answers with an offer
              </div>
              <Code>{OFFER_EXAMPLE}</Code>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div>
              <div className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
                2 · One retry satisfies every gate
              </div>
              <Code>{INVOKE_EXAMPLE}</Code>
            </div>
          </Reveal>
        </div>
        <Reveal delay={200}>
          <p className="mt-8 max-w-3xl text-balance text-muted-foreground">
            The offers are ordinary <span className="text-foreground">capability links</span> —
            the same primitive that powers the rest of the Hyperactive Web — so an offer is
            just a service card scoped to one guarded resource, and contract addressing lets
            agents price-compare doorkeepers offering the very same capability. Results
            advertise their own next affordances; a follow-up question inside a session can
            carry a discounted price.
          </p>
        </Reveal>
      </Section>

      {/* THE GRANT */}
      <Section id="grant">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <SectionHeading
              eyebrow="§ 04 · What leaves, and on what terms"
              title={<>The usage grant is the anti-theft half.</>}
            />
          </Reveal>
          <Reveal delay={120} className="lg:col-span-7">
            <p className="text-lg leading-relaxed text-muted-foreground">
              Proof and payment gate the way in; the{" "}
              <span className="text-foreground">grant</span> governs what leaves. Every
              delivered answer carries a signature from the doorkeeper binding{" "}
              <em>what was delivered</em> (a content hash), <em>under which contract</em>,{" "}
              <em>paid how</em>, and <em>to whom</em> — the identity proven at the door, not
              an ephemeral bot. Scopes like <Mono>training: prohibited</Mono> and cache
              expiries are machine-enforceable policy inputs for well-behaved runtimes.
            </p>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              This is not a DRM fantasy. A grant does not make bytes uncopyable; it makes
              extraction{" "}
              <span className="text-foreground">
                identified, priced, licensed, and evidenced
              </span>{" "}
              — the same economic-and-legal security model, backed by cryptography, that
              makes commerce work everywhere else. A leaked answer is attributable to the
              identity that bought it: the exact opposite of anonymous scraping.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* SECURITY */}
      <Section id="security">
        <Reveal>
          <SectionHeading
            eyebrow="§ 05 · Hardening"
            title={<>Designed against the obvious attacks.</>}
          />
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {SECURITY.map((c, i) => (
            <Reveal key={c.t} delay={i * 80}>
              <article className="h-full rounded-2xl border hairline bg-card/40 p-7">
                <div className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-display text-2xl">{c.t}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{c.d}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* CLOSING */}
      <Section id="one-sentence">
        <Reveal>
          <blockquote className="mx-auto max-w-3xl text-balance text-center font-display text-3xl leading-snug sm:text-4xl">
            x401 proves who's at the door, x402 pays the toll, and{" "}
            <span className="text-gradient">x403 is the door</span> — a doorkeeper that
            answers every request for your knowledge with a signed, priced, provable offer
            of what may be done with it instead.
          </blockquote>
        </Reveal>
      </Section>
    </>
  );
}
