// Client-side port of Sources/UniversalInteractionKit/CapabilityWeb.swift's
// CapabilityWebSurface. Lets the browser re-render a service card at any zoom
// level instantly, without a round-trip to the Swift backend. The same surface
// JSON the backend produces is accepted verbatim by <A2UISurface>; this builder
// is only for local, agent-free zooming.

import {
  affordanceFromLink,
  SUMMARY_AFFORDANCE_COUNT,
  zoomLevel,
  type DynamicUIDocument,
  type DynamicUIElement,
  type JSONValue,
  type ServiceCard,
  type SurfaceZoom,
} from "./types";

function newID(): string {
  const c = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;
  if (c?.randomUUID) return c.randomUUID();
  return `surface-${Math.floor(Math.random() * 1e9).toString(16)}`;
}

function nowISO(): string {
  return new Date().toISOString();
}

/** Render a service card at a semantic zoom level (progressive disclosure). */
export function buildServiceCardSurface(
  card: ServiceCard,
  zoom: SurfaceZoom = "summary",
): DynamicUIDocument {
  const metadata: Record<string, JSONValue> = {
    provider: card.provider,
    serviceURI: card.serviceURI,
    authRequired: card.authRequired,
  };
  if (card.supportedProtocols.length > 0) {
    metadata.protocols = card.supportedProtocols;
  }
  if (card.metadata.trust !== undefined) metadata.trust = card.metadata.trust;
  if (card.metadata.status !== undefined) metadata.status = card.metadata.status;
  if (card.identity) {
    metadata.identity = `${card.identity.scheme}:${card.identity.id}`;
    metadata.identityVerified = card.identity.verified;
  }

  const elements: DynamicUIElement[] = [
    { type: "card", title: card.name, body: card.description, metadata },
  ];

  const level = zoomLevel(zoom);

  // Level 1+: primary affordances (a steerable subset at summary, all deeper).
  if (level >= zoomLevel("summary")) {
    const showAll = level > zoomLevel("summary");
    const primary = showAll
      ? card.capabilities
      : card.capabilities.slice(0, SUMMARY_AFFORDANCE_COUNT);
    elements.push({
      type: "affordances",
      title: showAll ? "All capabilities" : "Capabilities",
      items: primary.map(affordanceFromLink),
    });
  }

  // Level 2+: full catalog with schemas and gating.
  if (level >= zoomLevel("detail")) {
    const rows = card.capabilities.map((link) => [
      link.rel,
      link.method,
      link.declaredRisk,
      link.requiresConfirmation ? "confirm" : "auto",
    ]);
    elements.push({
      type: "table",
      columns: ["capability", "method", "risk", "gate"],
      rows,
    });
  }

  // Level 3: policy / provenance internals.
  if (level >= zoomLevel("internals")) {
    const protocols =
      card.supportedProtocols.length > 0 ? card.supportedProtocols.join(", ") : "—";
    elements.push({
      type: "card",
      title: "Policy & provenance",
      body: `Provider ${card.provider} · protocols: ${protocols} · auth ${
        card.authRequired ? "required" : "none"
      }`,
      metadata: { serviceURI: card.serviceURI },
    });
  }

  return {
    id: { rawValue: newID() },
    createdAt: nowISO(),
    title: card.name,
    elements,
    parentArtifactIDs: [],
    metadata: { surfaceKind: "serviceCard", serviceID: card.id, zoom },
  };
}

/** The zoomed-out "whole society" view: every service as a compact node. */
export function buildConstellationSurface(cards: ServiceCard[]): DynamicUIDocument {
  return {
    id: { rawValue: newID() },
    createdAt: nowISO(),
    title: "Capability Web",
    elements: cards.map((card) => ({
      type: "card" as const,
      title: card.name,
      body: card.description,
      metadata: {
        serviceID: card.id,
        capabilities: card.capabilities.length,
      },
    })),
    parentArtifactIDs: [],
    metadata: { surfaceKind: "constellation", zoom: "overview" },
  };
}
