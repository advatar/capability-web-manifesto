import { createFileRoute } from "@tanstack/react-router";
import { Reveal, Section, SectionHeading, ZoomDemo } from "../components/manifesto";

export const Route = createFileRoute("/capabilities")({
  component: CapabilitiesPage,
});

function CapabilitiesPage() {
  return (
    <>
      {/* CARDS & BUTTONS */}
      <Section id="cards">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <SectionHeading eyebrow="§ 01 · Lineage" title={<>Before the web, there was HyperCard.</>} />
          </Reveal>
          <Reveal delay={120} className="lg:col-span-7">
            <p className="text-lg leading-relaxed text-muted-foreground">
              Decades ago, HyperCard gave us cards connected by buttons that
              didn't just navigate — they <span className="text-foreground">did things</span>.
              The document web kept the link and dropped the button. The
              Hyperactive Web restores it: a service card is a card; a capability
              link is a button that acts — now networked, governed, and
              self-describing.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* ZOOM */}
      <Section id="zoom">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          <Reveal className="lg:col-span-5">
            <SectionHeading eyebrow="§ 02 · Steering" title={<>Your node drives. You zoom in to steer.</>} />
            <p className="mt-7 max-w-md leading-relaxed text-muted-foreground">
              Most of the time your node works on your behalf and hands you off
              between services. When you want control, you zoom in — not visual
              scale, but meaning. A compact node becomes primary actions, then the
              full catalog, then the policy and provenance underneath. Progressive
              disclosure as a steering dial, always within your reach.
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

      {/* AMBIENT */}
      <Section id="ambient">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <SectionHeading eyebrow="§ 03 · Ambient" title={<>Ask for the capability, not the computer.</>} />
          </Reveal>
          <Reveal delay={120} className="lg:col-span-7">
            <p className="text-lg leading-relaxed text-muted-foreground">
              Just as content-addressed storage dissolved a file's location,
              contract-addressing dissolves a capability's location. A capability
              is identified by what it <span className="text-foreground">promises</span> —
              its intent, schema, and risk — as a name, not a server. Any provider
              that honors the contract can fulfill it; read-only answers can come
              from anywhere, even from cache, while actions that change the world
              stay exactly-once. Intelligence becomes ambient — and your node is
              how you reach into it on your terms.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border hairline bg-card/40 p-4">
                <div className="mb-1 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                  contract address
                </div>
                <div className="font-mono text-[0.85rem] break-all text-foreground/85">capability:sha256:9f2a…b4c1</div>
              </div>
              <div className="rounded-xl border hairline bg-card/40 p-4">
                <div className="mb-1 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                  agent endpoint
                </div>
                <div className="font-mono text-[0.85rem] break-all text-foreground/85">a2a+https://atlas.commons.example</div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* PAYMENTS */}
      <Section id="payments">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <SectionHeading eyebrow="§ 04 · Economy" title={<>Capabilities aren't all free.</>} />
          </Reveal>
          <Reveal delay={120} className="lg:col-span-7">
            <p className="text-lg leading-relaxed text-muted-foreground">
              Some capabilities cost money — data, compute, a booking fee. The
              hyperactive web revives HTTP's dormant{" "}
              <span className="text-foreground">402 Payment Required</span>: a
              provider answers a paid request with a payment challenge, your node
              authorizes through a wallet or a shared payment token, and the
              request is retried with proof. It is payment-agnostic — stablecoins
              or ordinary cards — and it is <span className="text-foreground">just another gate</span>:
              nothing is delivered until you authorize, and every payment leaves a
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
                <div className="font-mono text-[0.85rem] break-all text-foreground/85">MPP amount="0.02" currency="usd"</div>
              </div>
              <div className="rounded-xl border hairline bg-card/40 p-4">
                <div className="mb-1 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                  retained receipt
                </div>
                <div className="font-mono text-[0.85rem] break-all text-foreground/85">paid · 0.02 USD · rail=card</div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
