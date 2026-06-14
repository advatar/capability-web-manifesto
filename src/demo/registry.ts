// Demo registry: three travel capabilities that exercise the whole stack —
// a free, DNS-ID-verified read-only search; a paid (402/MPP) premium-rates
// lookup; and a high-risk booking behind a confirmation gate.

import type {
  AdapterInvocationResult,
  CapabilityLink,
  CapabilityPrice,
  JSONValue,
  ServiceCard,
} from "./types";

export interface DemoCapability extends CapabilityLink {
  /** Demo-only: a fixed price marks this capability as 402-gated. */
  price?: CapabilityPrice;
}

export interface DemoServiceCard extends Omit<ServiceCard, "capabilities"> {
  capabilities: DemoCapability[];
}

function link(partial: Partial<DemoCapability> & { rel: string; title: string; capabilityID: string }): DemoCapability {
  return {
    href: `a2a+https://travel.example/skills/${partial.capabilityID}`,
    method: "delegate",
    adapterID: "travel",
    inputSchema: { type: "object" },
    declaredRisk: "readOnly",
    requiresConfirmation: false,
    preferredSurface: "dynamicUI",
    metadata: {},
    ...partial,
  };
}

export const travelCard: DemoServiceCard = {
  id: "travel",
  name: "Atlas Travel Concierge",
  description: "Finds, prices, and books refundable stays.",
  provider: "travel",
  serviceURI: "a2a+https://travel.example/.well-known/agent-card.json",
  adapterID: "travel",
  supportedProtocols: ["a2a", "mcp"],
  authRequired: false,
  identity: { scheme: "dns-id", id: "_agent.travel.example", verified: false, metadata: {} },
  metadata: {},
  capabilities: [
    link({
      rel: "hotel.search",
      title: "Search refundable hotels",
      capabilityID: "hotel_search",
      declaredRisk: "readOnly",
      inputSchema: {
        type: "object",
        properties: { city: { type: "string" }, weekend: { type: "string" } },
        required: ["city"],
      },
    }),
    link({
      rel: "hotel.premiumRates",
      title: "Unlock premium nightly rates",
      capabilityID: "premium_rates",
      declaredRisk: "readOnly",
      price: { amount: "0.02", currency: "usd" },
      inputSchema: { type: "object", properties: { city: { type: "string" } }, required: [] },
    }),
    link({
      rel: "hotel.book",
      title: "Book the selected room",
      capabilityID: "book_hotel",
      declaredRisk: "financialOrLegal",
      requiresConfirmation: true,
      inputSchema: {
        type: "object",
        properties: { hotelID: { type: "string" } },
        required: ["hotelID"],
      },
    }),
  ],
};

/** A mock adapter: 402s on paid capabilities until a payment proof is present. */
export function mockInvoke(
  capabilityID: string,
  _args: JSONValue,
  paid: boolean,
): AdapterInvocationResult {
  const cap = travelCard.capabilities.find((c) => c.capabilityID === capabilityID);
  if (cap?.price && !paid) {
    return {
      ok: false,
      retainedArtifactIDs: [],
      paymentRequired: {
        scheme: "MPP",
        price: cap.price,
        payTo: "acct_atlas",
        rails: ["stablecoin", "card"],
        metadata: {},
      },
    };
  }

  switch (capabilityID) {
    case "hotel_search":
      return ok({
        results: [
          { id: "h_nordic", name: "Nordic Light Hotel", sek: 1450, refundable: true },
          { id: "h_grand", name: "Grand Stockholm", sek: 2190, refundable: true },
        ],
      });
    case "premium_rates":
      return ok({ h_nordic: 1290, h_grand: 1990, note: "member rates" });
    case "book_hotel":
      return ok({ confirmation: "ATLAS-7741", status: "booked" });
    default:
      return { ok: false, error: `unknown capability ${capabilityID}`, retainedArtifactIDs: [] };
  }
}

function ok(data: JSONValue): AdapterInvocationResult {
  return { ok: true, data, retainedArtifactIDs: [] };
}
