import { createFileRoute } from "@tanstack/react-router";
import {
  BrIAnLink,
  HumanNodeDiagram,
  OpenMindLink,
  Reveal,
  Section,
  SectionHeading,
} from "../components/manifesto";

export const Route = createFileRoute("/you")({
  component: YouPage,
});

function YouPage() {
  return (
    <>
      {/* YOU ARE A NODE */}
      <Section id="node" className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px max-w-[60%]"
          style={{ background: "var(--gradient-accent)", opacity: 0.5 }}
        />
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
              § 01 · The human, restored
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
            When intelligence is everywhere, the danger is that the human becomes
            a spectator — querying a cloud that doesn't know them. The Hyperactive
            Web answers this directly:{" "}
            <span className="text-foreground">
              every person is represented by a personal node in the society of agents.
            </span>{" "}
            That node carries your memory — everything your agents have seen,
            said, retrieved, and done — and it speaks and acts for you, within
            boundaries you set. It is your standing self in the web: persistent,
            sovereign, and accountable to you alone.
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
                { k: "Represented", v: "A node that is unmistakably you, with its own identity, among all the others." },
                { k: "Remembered", v: "Your node holds your durable memory and the provenance of everything done in your name. Nothing important lives only in a fleeting prompt." },
                { k: "Sovereign", v: "Your node enforces your consent: it delegates what you allow, asks before consequential actions, and answers to you." },
              ].map((c) => (
                <div key={c.k} className="rounded-2xl border hairline bg-card/50 p-6 transition-colors hover:bg-card/80">
                  <div className="font-display text-2xl">{c.k}.</div>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">{c.v}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={300}>
          <p className="mx-auto mt-14 max-w-2xl text-center text-sm text-muted-foreground">
            Your node speaks <OpenMindLink /> — the open protocol of memory,
            identity, and provenance. It is how your node remembers, proves what
            was done in your name, and stays portably yours across every service.
            On Apple devices, <BrIAnLink /> projects that node into native surfaces
            — App Intents, Spotlight, Siri — so your memory and agents are one tap
            away. The role is open and the memory is yours.
          </p>
        </Reveal>
      </Section>

      {/* IDENTITY */}
      <Section id="identity">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <SectionHeading eyebrow="§ 02 · Identity" title={<>Who is speaking? Verifiable identity.</>} />
          </Reveal>
          <Reveal delay={120} className="lg:col-span-7">
            <p className="text-lg leading-relaxed text-muted-foreground">
              The web gave us addresses and links but never a native way to{" "}
              <span className="text-foreground">prove who is on the other end</span>,
              and never a way to pay. The Hyperactive Web adds those two missing
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
              asserted. Your personal node carries a sovereign, portable identity;
              services prove who they are before you trust a capability; and every
              capability link is bound to a named principal you can check. Where
              DNS-ID isn't yet in place, today's node-issued keys stand in as a
              shim — same shape, swappable underneath.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border hairline bg-card/40 p-4">
                <div className="mb-1 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                  agent identity
                </div>
                <div className="font-mono text-[0.85rem] break-all text-foreground/85">dns-id · _agent.atlas.example</div>
              </div>
              <div className="rounded-xl border hairline bg-card/40 p-4">
                <div className="mb-1 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                  personal node · shim
                </div>
                <div className="font-mono text-[0.85rem] break-all text-foreground/85">node-key · openmind:self</div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* SOCIETY / GOVERNED */}
      <Section id="society">
        <Reveal>
          <figure className="mx-auto max-w-4xl text-center">
            <blockquote className="font-display text-2xl leading-[1.25] text-foreground sm:text-4xl">
              "The power of intelligence stems from our vast diversity, not from
              any single, perfect form."
            </blockquote>
            <figcaption className="mt-5 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
              Marvin Minsky · The Society of Mind
            </figcaption>
          </figure>
        </Reveal>

        <div className="mt-20 grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <SectionHeading eyebrow="§ 03 · Governed" title={<>Not emergent magic. Governed — in your favor.</>} />
          </Reveal>
          <Reveal delay={120} className="lg:col-span-7">
            <p className="text-lg leading-relaxed text-muted-foreground">
              This is a society of many specialized, capable agents — but a society
              with a constitution, and you are a <span className="text-foreground">citizen</span> of
              it, not its subject. Every consequential action carries a declared
              risk, a locally enforced verdict, and a retained, auditable trail of
              what happened and who approved it. You own your memory; you can see
              why anything was done; you can reverse what should be reversible.
              Trust comes not because intelligence appears from nowhere, but
              because every action is explicit, accountable, and answerable to a
              human node. That retained, auditable trail is not an afterthought —
              it is <OpenMindLink /> doing its work: every action remembered,
              attributable, and answerable to a human node.
            </p>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
