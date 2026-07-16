import { createFileRoute, Link } from "@tanstack/react-router";
import { Mono, Reveal, Section, SectionHeading } from "../components/manifesto";

export const Route = createFileRoute("/humancard")({
  component: HumanCardPage,
  head: () => ({
    meta: [
      { title: "HumanCard — your capabilities have an address · The Hyperactive Web" },
      {
        name: "description",
        content:
          "HumanCard is the human profile of a Hyperactive Service Card: your personal node publishes what you offer, what your agents may handle, and exactly what requires you — with authorship and authority explicit.",
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

const RESUME_VS_CARD = `A résumé says:
    "This person knows software architecture."

A HumanCard says:
    "Reviews a proposed architecture under these terms,
     through this endpoint, with the final opinion
     personally signed — researched by an agent,
     drafted by an agent, judged by the human."`;

const THREE_IDS = [
  { k: "The document", v: "card.id", d: "The address of the card itself." },
  { k: "The principal", v: "subject", d: "The accountable human — represented through a node, never modelled as one." },
  { k: "The publisher", v: "identity", d: "The personal node that publishes and operates the card." },
] as const;

const CORRECTIONS = [
  {
    t: "A human is a principal, not an endpoint.",
    d: "The person is represented through a node. That's what lets them change providers, publish from several nodes, or rotate keys without changing who they are.",
  },
  {
    t: "Offers, not skills.",
    d: '"Knows architecture" is a claim. "Reviews architecture under these terms, human sign-off required" is a machine-composable service an agent can request.',
  },
  {
    t: "Consent is provider-side.",
    d: "A person's decision to accept an engagement is not a gate the requester can satisfy by paying or proving. It's a human commitment — a stage only the person clears.",
  },
  {
    t: "Representation is not impersonation.",
    d: "Every consequential result discloses who requested, prepared, reviewed, approved, signed, and delivered it. The agent says “acting for Alex” — never “I am Alex.”",
  },
  {
    t: "No presence signals.",
    d: 'A card never publishes "asleep", "in surgery", or "on vacation". Availability is a coarse, negotiated query — an agent needs to know if an offer can be fulfilled, not why you’re away.',
  },
  {
    t: "No single reputation number.",
    d: "A surgeon, cryptographer, and reviewer can't be one score. Assurances are per-claim, sourced, and expirable — usually a verifiable credential, proven not copied.",
  },
] as const;

const CARD_EXAMPLE = `{
  "type": "ServiceCard",
  "profiles": ["…/profiles/human/v0.1"],

  "id":       "https://alex-node.example/cards/alex",  // document
  "subject":  { "kind": "human", "id": "…/alex" },      // principal
  "identity": { "scheme": "dns-id", "id": "alex-node.example" }, // publisher

  "offers": [{
    "rel": "architecture.review",
    "fulfillment": {
      "modes": ["human", "hybrid"],
      "humanCommitments": [
        { "stage": "engagement-acceptance", "required": true },
        { "stage": "final-review",          "required": true },
        { "stage": "signed-opinion",        "required": true }
      ]
    },
    "authority": { "effect": "non-binding-advice", "scope": "software-architecture" },
    "availability": { "mode": "negotiated" },
    "assurances": [{ "claim": "professional-role", "credential": "…/vc" }]
  }]
}`;

function HumanCardPage() {
  return (
    <>
      {/* HERO */}
      <Section id="humancard">
        <Reveal>
          <div className="font-mono text-[0.72rem] uppercase tracking-[0.28em] text-muted-foreground">
            A profile of the Hyperactive Service Card
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="font-display mt-7 max-w-4xl text-5xl leading-[1.02] tracking-tight sm:text-6xl">
            <span className="text-gradient">HumanCard</span>
          </h1>
        </Reveal>
        <Reveal delay={140}>
          <p className="font-display mt-5 text-2xl text-foreground sm:text-3xl">
            Your capabilities have an address.
          </p>
        </Reveal>
        <Reveal delay={220}>
          <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Your personal node publishes what you offer, what your agents may
            handle, and what requires you. People and agents can discover those
            capabilities, request them on your terms, and receive a result whose{" "}
            <span className="text-foreground">authorship and authority are explicit</span>.
          </p>
        </Reveal>
      </Section>

      {/* RESUME VS CARD */}
      <Section id="offers">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <SectionHeading
              eyebrow="§ 01 · Offers, not a résumé"
              title={<>The web stops describing you and starts representing you.</>}
            />
          </Reveal>
          <Reveal delay={120} className="lg:col-span-7">
            <p className="text-lg leading-relaxed text-muted-foreground">
              The document web publishes pages <em>about</em> people. A HumanCard
              publishes what a person <em>offers</em> — a machine-composable
              service an agent can discover, request, and pay for, with the
              person's judgment and authority intact.
            </p>
            <div className="mt-8">
              <Code>{RESUME_VS_CARD}</Code>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* THREE IDENTITIES */}
      <Section id="principal">
        <Reveal>
          <SectionHeading
            eyebrow="§ 02 · Three identities, kept separate"
            title={<>The human is the principal. The node is the endpoint. The card is the description.</>}
          />
        </Reveal>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {THREE_IDS.map((row, i) => (
            <Reveal key={row.v} delay={i * 100}>
              <article className="h-full rounded-2xl border hairline bg-card/40 p-7">
                <div className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
                  {row.k}
                </div>
                <div className="mt-3 font-mono text-lg text-gradient">{row.v}</div>
                <p className="mt-3 leading-relaxed text-muted-foreground">{row.d}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delay={220}>
          <p className="mt-8 max-w-3xl text-balance text-muted-foreground">
            Conflating any two of these breaks the moment a person changes node
            providers or rotates a key. An external agent never has to work out
            whether it's talking to you, your assistant, or an autonomous
            workflow — it asks for the <Mono>capability</Mono>, and the card
            declares who's accountable and where you are required.
          </p>
        </Reveal>
      </Section>

      {/* THE CARD */}
      <Section id="shape">
        <Reveal>
          <SectionHeading
            eyebrow="§ 03 · A profile, not a protocol"
            title={<>It's your Service Card, wearing a human profile.</>}
          />
        </Reveal>
        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <Code>{CARD_EXAMPLE}</Code>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-lg leading-relaxed text-muted-foreground">
              No new protocol, no new status code. A <Mono>profiles</Mono> list
              turns a generic card into a HumanCard; the human semantics live in
              a self-contained profile document. The same mechanism gives
              organizations, devices, and knowledge services their own profiles
              later — a new key, never a new stack.
            </p>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              And the crucial distinction: the{" "}
              <span className="text-foreground">human commitments</span> —
              accept the engagement, review, sign — are <em>not</em>{" "}
              <Link to="/x403" className="text-foreground underline decoration-dotted underline-offset-4 hover:opacity-80">
                x403
              </Link>{" "}
              gates. A gate is something a requester satisfies by proving or
              paying. A person deciding to take the work is provider-side; no
              credential opens it.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* CORRECTIONS */}
      <Section id="rules">
        <Reveal>
          <SectionHeading
            eyebrow="§ 04 · What it gets right by construction"
            title={<>Sovereignty is in the data model, not the marketing.</>}
          />
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {CORRECTIONS.map((c, i) => (
            <Reveal key={c.t} delay={i * 70}>
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
      <Section id="closing">
        <Reveal>
          <blockquote className="mx-auto max-w-3xl text-balance text-center font-display text-3xl leading-snug sm:text-4xl">
            People are principals, not APIs. Your capabilities can be addressed;{" "}
            <span className="text-gradient">your attention and authority stay yours</span>.
          </blockquote>
        </Reveal>
      </Section>
    </>
  );
}
