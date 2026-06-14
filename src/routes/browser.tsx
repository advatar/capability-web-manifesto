import { createFileRoute } from "@tanstack/react-router";
import { Chip, Reveal, Section, SectionHeading } from "../components/manifesto";

export const Route = createFileRoute("/browser")({
  component: BrowserPage,
});

function BrowserPage() {
  return (
    <>
      {/* BROWSER */}
      <Section id="browser">
        <Reveal>
          <SectionHeading eyebrow="§ 01 · The first browser" title={<>dBrowser speaks every web.</>} />
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            The layer is open — anyone can build a client. The first is{" "}
            <span className="text-foreground">dBrowser</span>, a native macOS
            browser that speaks all of the webs at once: the{" "}
            <span className="text-foreground">Web</span> of documents, the{" "}
            <span className="text-foreground">Web&nbsp;2</span> of apps and APIs,
            the <span className="text-foreground">Web&nbsp;3</span> of wallets and
            chains — and now, the first to traverse the{" "}
            <span className="text-foreground">Hyperactive Web</span> of agents and
            capabilities, natively, with your node in control.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-4">
            {[
              ["Web", "documents — read"],
              ["Web 2", "apps & APIs — interact"],
              ["Web 3", "wallets & chains — own"],
              ["Hyperactive", "agents & capabilities — delegate"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border hairline bg-card/40 p-4">
                <div className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-foreground">{k}</div>
                <div className="mt-1 text-[0.85rem] text-muted-foreground">{v}</div>
              </div>
            ))}
          </div>
          <a
            href="https://dBrowser.app"
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm text-primary-foreground transition-transform hover:scale-[1.02]"
            style={{ background: "var(--gradient-accent)" }}
          >
            Get dBrowser →
          </a>
        </Reveal>
      </Section>

      {/* GLOSSARY */}
      <Section id="glossary">
        <Reveal>
          <SectionHeading eyebrow="§ 02 · Vocabulary" title={<>Glossary.</>} />
        </Reveal>
        <Reveal delay={140}>
          <dl className="mt-12 grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {[
              ["Capability", "A specific thing a service can do, under a declared contract."],
              ["Capability Link", "The typed, policy-aware successor to the hyperlink."],
              ["Affordance", "A capability link offered in a specific state; the next valid action."],
              ["Surface", "A dynamic, zoomable interaction state."],
              ["Service Card", "The public, self-describing entry point of a service."],
              ["Personal Node", "The agent node that represents a human: their memory, identity, and consent."],
              ["Registry", "The public square where services advertise their capabilities."],
              ["OpenMind", "The open protocol of memory, identity, and provenance; how a personal node remembers, proves what was done, and carries a portable self."],
              ["DNS-ID", "DNS-anchored, verifiable identity for agents and nodes; today's node keys shim it until it is universal."],
              ["402 / MPP", "Payment as a gate: a paid capability is delivered only after your node authorizes, leaving a retained receipt."],
              ["Composability", "Capabilities call each other like functions across vendors and protocols — flows assemble themselves instead of being hand-wired."],
            ].map(([term, def]) => (
              <div key={term} className="flex flex-col gap-2 border-t hairline pt-5">
                <dt>
                  <Chip>
                    {term === "OpenMind" ? (
                      <a href="https://openmind.advatar.systems" target="_blank" rel="noreferrer" className="hover:opacity-80">
                        OpenMind
                      </a>
                    ) : (
                      term
                    )}
                  </Chip>
                </dt>
                <dd className="text-[0.95rem] leading-relaxed text-muted-foreground">{def}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Section>
    </>
  );
}
