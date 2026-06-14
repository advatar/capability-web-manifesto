import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BeforeAfterDiagram,
  CapabilityFlow,
  Constellation,
  PlaceholderButton,
  Reveal,
  Section,
  SectionHeading,
} from "../components/manifesto";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b hairline">
        <div className="absolute inset-0">
          <Constellation />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 0%, var(--background) 75%)" }}
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
              Hyperactive Web is alive — a <span className="text-foreground">buzz</span> of
              agents discovering, invoking, and paying each other across the
              network. The order is yours: you keep it through your own node —
              one that remembers for you, acts on your behalf, and answers only
              to you.
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

      {/* COMMONS */}
      <Section id="commons">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <SectionHeading eyebrow="§ 01 · Commons" title={<>Open, like the web itself.</>} />
          </Reveal>
          <Reveal delay={120} className="lg:col-span-7">
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
              <p>
                The Web and the InterPlanetary File System were never owned. They
                were open protocols anyone could speak. The Hyperactive Web is
                meant the same way — <span className="text-foreground">a public layer, not a platform.</span>
              </p>
              <p>
                No gatekeeper decides who participates. Anyone can publish a
                capability, run a node, or represent themselves. Products will be
                built on top of it; the layer underneath belongs to everyone.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* THE LINK */}
      <Section id="doing">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <SectionHeading eyebrow="§ 02 · The link" title={<>The hyperlink grew up.</>} />
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

      {/* HOW IT WORKS — interactive */}
      <Section id="how">
        <Reveal>
          <SectionHeading
            eyebrow="§ 03 · How it works"
            title={<>Anatomy of one capability call.</>}
          />
          <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">
            Discover, verify, address, run, gate, pay, remember. Step through a
            single interaction — every stop is one of the things the Hyperactive
            Web makes possible, and which your node keeps under control.
          </p>
        </Reveal>
        <Reveal delay={160} className="mt-12">
          <CapabilityFlow />
        </Reveal>
        <Reveal delay={220} className="mt-8">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/demo"
              className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm text-primary-foreground transition-transform hover:scale-[1.02]"
              style={{ background: "var(--gradient-accent)" }}
            >
              Launch the travel demo →
            </Link>
            <span className="text-sm text-muted-foreground">
              A planner drives a real plan through the gates — search, pay, book — answerable by voice.
            </span>
          </div>
        </Reveal>
      </Section>

      {/* AT A GLANCE */}
      <Section id="shift">
        <Reveal>
          <SectionHeading eyebrow="§ 04 · At a glance" title={<>Web → Hyperactive Web.</>} />
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
                  ["Link: hyperlink → a document", "Link: capability link → an action"],
                  ["Node: web page", "Node: service card"],
                  ["Renderer: the browser", "Renderer: a zoomable surface"],
                  ["You: a user at a browser", "You: a node in the society, represented and remembered"],
                  ["Identity: none / ad-hoc logins", "Identity: DNS-anchored (DNS-ID)"],
                  ["Payment: free to read", "Payment: pay-per-capability (402 / MPP)"],
                  ["Composition: bespoke glue per integration", "Composition: capabilities compose like functions"],
                  ["Memory: none — documents are stateless", "Memory: OpenMind — a durable, portable ledger held by each node"],
                  ["Verb: read", "Verb: do"],
                ].map(([a, b], i, arr) => (
                  <tr key={i} className={i < arr.length - 1 ? "border-b hairline" : ""}>
                    <td className="px-4 py-4 text-muted-foreground sm:px-6">{a}</td>
                    <td className="px-4 py-4 text-foreground sm:px-6">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </Section>

      {/* CLOSING */}
      <section className="relative overflow-hidden border-t hairline px-6 py-32 lg:px-10 lg:py-44">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{ background: "radial-gradient(ellipse at 50% 80%, color-mix(in oklab, var(--accent-violet) 18%, transparent), transparent 60%)" }}
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <Reveal>
            <h2 className="font-display text-3xl leading-[1.05] sm:text-5xl lg:text-6xl">
              The web let us reach the world's documents. The Hyperactive Web lets
              us reach the world's <span className="text-gradient">capabilities</span> —
              and gives each of us a node within it: represented, remembered, in
              control.
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mx-auto mt-10 max-w-xl text-muted-foreground">
              This layer is open. Read it, build on it, run a node.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <PlaceholderButton variant="primary">Run a node</PlaceholderButton>
              <PlaceholderButton>Publish a capability</PlaceholderButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
