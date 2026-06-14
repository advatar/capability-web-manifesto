import { createFileRoute } from "@tanstack/react-router";
import { OpenMindLink, Reveal, Section, SectionHeading } from "../components/manifesto";

export const Route = createFileRoute("/protocols")({
  component: ProtocolsPage,
});

function ProtocolsPage() {
  return (
    <>
      {/* IT ALREADY RUNS */}
      <Section id="today">
        <Reveal>
          <SectionHeading eyebrow="§ 01 · No new internet" title={<>A new representation, on the web you have.</>} />
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {[
            { t: "A new media type, not a new picture.", d: "Images and video are passive — they render the same forever. A capability surface is active hypermedia: its content is actions you can take. Its ancestor is HTML, not JPEG." },
            { t: "Same URL, two faces.", d: "Through content negotiation, one address can return a human web page or a machine-readable capability card depending on what asks for it." },
            { t: "Discoverable today.", d: "Services publish a card at a well-known address, and ordinary pages can advertise their capability layer with a simple link relation. A normal browser can already fetch it." },
            { t: "Addresses that compose.", d: "Capability addresses ride on plain HTTPS, so every CDN, proxy, and firewall already understands them. The browser shows the page; an agent runtime follows the actions." },
          ].map((c, i) => (
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

      {/* PROTOCOLS */}
      <Section id="protocols">
        <Reveal>
          <SectionHeading eyebrow="§ 02 · The protocols, one fabric" title={<>The protocols.</>} />
        </Reveal>

        <div className="mt-14 overflow-hidden rounded-2xl border hairline">
          {[
            { k: "A2A", t: "Discovery and delegation.", d: "How services and agents introduce themselves and hand off work; an agent's card is its homepage." },
            { k: "MCP", t: "The substrate.", d: "The substrate of tools and resources an agent draws on." },
            { k: "A2UI", t: "The surfaces.", d: "Safe, native, agent-generated interfaces rendered across platforms without running arbitrary code." },
            { k: "OpenMind", t: "Memory, identity, and provenance.", d: "The open protocol by which a node remembers everything it has seen, said, retrieved, and done; proves what happened; and carries a portable, durable self across services. It is what lets a personal node represent a human: persistent memory under the person's control, with an auditable trail behind every action." },
            { k: "Capability Links", t: "The connective tissue.", d: "Typed, policy-aware links that bind discovery, tools, surfaces, and memory into something you can navigate." },
          ].map((p, i) => (
            <Reveal key={p.k} delay={i * 80}>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-6 border-b hairline px-6 py-7 last:border-b-0 sm:grid-cols-[160px_1fr_auto] sm:items-baseline sm:px-10">
                <div className={`font-mono text-sm tracking-wide ${p.k === "OpenMind" ? "text-accent-openmind" : "text-gradient"}`}>
                  {p.k === "OpenMind" ? (
                    <a href="https://openmind.advatar.systems" target="_blank" rel="noreferrer" className="text-accent-openmind underline decoration-dotted underline-offset-4 hover:opacity-80">
                      OpenMind
                    </a>
                  ) : (
                    p.k
                  )}
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
            A2A is the etiquette, MCP the materials, A2UI the workspace, <OpenMindLink /> the
            memory — and the self that remembers. Capability links are the
            contracts that bind them.
          </p>
        </Reveal>
      </Section>

      {/* COMPOSABLE */}
      <Section id="composable">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <SectionHeading eyebrow="§ 03 · Composable" title={<>Capabilities call each other like functions.</>} />
          </Reveal>
          <Reveal delay={120} className="lg:col-span-7">
            <p className="text-lg leading-relaxed text-muted-foreground">
              The base protocols are real but <span className="text-foreground">siloed</span> —
              MCP tools don't know about A2A agents, neither renders through A2UI
              without bespoke glue, and today's agent stacks are hand-wired one
              orchestration at a time. The Hyperactive Web is the layer that makes
              them <span className="text-foreground">compose</span>. A contract
              address names what is wanted, so any provider on any protocol can
              satisfy it; a capability link carries the schema and risk, so one
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
              <div className="font-mono text-[0.85rem] break-all text-foreground/85">search → premium-rates → book → confirm</div>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
