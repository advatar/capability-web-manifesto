// TypeScript mirror of the UniversalInteractionKit A2UI wire model.
//
// These shapes match the JSON the Swift `Codable` types emit exactly, so a
// DynamicUIDocument produced by the Swift backend renders unchanged in the
// browser. Keep this file in lockstep with:
//   Sources/UniversalInteractionKit/DynamicUI.swift
//   Sources/UniversalInteractionKit/CapabilityLink.swift
//   Sources/UniversalInteractionKit/CapabilityRuntime.swift
//   Sources/UniversalInteractionKit/CapabilityWeb.swift

export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

/** `ArtifactID` is a single-field Codable struct, so it serializes as `{ rawValue }`. */
export interface ArtifactID {
  rawValue: string;
}

export type RiskLevel =
  | "readOnly"
  | "lowImpactWrite"
  | "externalCommunication"
  | "financialOrLegal"
  | "credentialOrSecurity"
  | "unknown";

export type SurfaceKind =
  | "text"
  | "structuredData"
  | "dynamicUI"
  | "swiftUI"
  | "realityKit";

export type CapabilityMethod = "delegate" | "invoke" | "call" | "open" | "read";

/** Bounded level-of-detail tiers; mirrors `SurfaceZoom`. */
export type SurfaceZoom = "overview" | "summary" | "detail" | "internals";

export const SURFACE_ZOOM_ORDER: SurfaceZoom[] = [
  "overview",
  "summary",
  "detail",
  "internals",
];

export const SUMMARY_AFFORDANCE_COUNT = 7;

export function zoomLevel(zoom: SurfaceZoom): number {
  return SURFACE_ZOOM_ORDER.indexOf(zoom);
}

// MARK: - A2UI surface elements

export type DynamicUIFieldType =
  | "text"
  | "number"
  | "date"
  | "toggle"
  | "picker";

export interface DynamicUIField {
  id: string;
  label: string;
  type: DynamicUIFieldType;
  required: boolean;
  options: string[];
  value?: JSONValue;
  /** When set, the field is voice-answerable and this is the spoken prompt. */
  voicePrompt?: string;
}

/** How a `question` element may be answered — by voice or tap. */
export type QuestionKind = "yesNo" | "text";

export interface DynamicUIAffordance {
  id: string;
  rel: string;
  title: string;
  risk: RiskLevel;
  requiresConfirmation: boolean;
  preferredSurface: SurfaceKind;
}

export interface CapabilityPrice {
  amount: string;
  currency: string;
}

export type DynamicUIElement =
  | { type: "text"; text: string }
  | { type: "card"; title: string; body: string; metadata: Record<string, JSONValue> }
  | { type: "table"; columns: string[]; rows: string[][] }
  | { type: "form"; id: string; title: string; fields: DynamicUIField[] }
  | { type: "confirmation"; id: string; title: string; detail: string; risk: RiskLevel }
  | { type: "affordances"; title: string; items: DynamicUIAffordance[] }
  | { type: "payment"; id: string; title: string; detail: string; price: CapabilityPrice; rails: string[] }
  | { type: "question"; id: string; prompt: string; kind: QuestionKind };

export interface DynamicUIDocument {
  id: ArtifactID;
  createdAt: string;
  title: string;
  elements: DynamicUIElement[];
  parentArtifactIDs: ArtifactID[];
  metadata: Record<string, JSONValue>;
}

// MARK: - Capability web

export interface CapabilityLink {
  rel: string;
  title: string;
  href: string;
  method: CapabilityMethod;
  adapterID: string;
  capabilityID: string;
  inputSchema: JSONValue;
  outputSchema?: JSONValue;
  declaredRisk: RiskLevel;
  requiresConfirmation: boolean;
  preferredSurface: SurfaceKind;
  metadata: Record<string, JSONValue>;
}

export type NodeIdentityScheme = "dns-id" | "node-key";

export interface NodeIdentity {
  scheme: NodeIdentityScheme;
  id: string;
  publicKey?: string;
  verified: boolean;
  metadata: Record<string, JSONValue>;
}

export interface ServiceCard {
  id: string;
  name: string;
  description: string;
  provider: string;
  serviceURI: string;
  adapterID: string;
  supportedProtocols: string[];
  identity?: NodeIdentity;
  authRequired: boolean;
  capabilities: CapabilityLink[];
  metadata: Record<string, JSONValue>;
}

// MARK: - Runtime (invocation + payments)

export interface PaymentRequirements {
  scheme: string;
  price: CapabilityPrice;
  payTo?: string;
  resource?: string;
  detail?: string;
  rails: string[];
  nonce?: string;
  expiresAt?: string;
  maxAmount?: CapabilityPrice;
  metadata: Record<string, JSONValue>;
}

export interface PaymentAuthorization {
  scheme: string;
  rail: string;
  proof: string;
  amount: CapabilityPrice;
  metadata: Record<string, JSONValue>;
}

export interface AdapterInvocationResult {
  ok: boolean;
  data?: JSONValue;
  error?: string;
  retainedArtifactIDs: ArtifactID[];
  dynamicUIArtifactID?: ArtifactID;
  paymentRequired?: PaymentRequirements;
}

export function affordanceFromLink(link: CapabilityLink): DynamicUIAffordance {
  return {
    id: `${link.method}:${link.adapterID}/${link.capabilityID}`,
    rel: link.rel,
    title: link.title,
    risk: link.declaredRisk,
    requiresConfirmation: link.requiresConfirmation,
    preferredSurface: link.preferredSurface,
  };
}
