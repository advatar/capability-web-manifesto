// A thin demo runtime that mirrors the Swift CapabilityOrchestrator + resolver
// in the browser: it runs a plan step by step, binds $refs across outputs, and
// applies the gates (elicitation → confirmation → payment), pausing for the
// user. Not the real resolver (that is Swift / dBrowser) — a scoped showcase.

import { buildServiceCardSurface } from "./surface";
import type {
  DynamicUIDocument,
  DynamicUIElement,
  JSONValue,
  PaymentRequirements,
  SurfaceZoom,
} from "./types";
import { travelCard, mockInvoke, type DemoCapability } from "./registry";

export interface ProvenanceEvent {
  kind: string;
  detail: string;
}

export interface BoundStep {
  id: string;
  capabilityID: string;
  args: Record<string, JSONValue>;
}

export interface DemoOutcome {
  document: DynamicUIDocument;
  provenance: ProvenanceEvent[];
  /** Structured result data when the step completed (threaded into later $refs). */
  output?: JSONValue;
  /** Present when the step paused on a gate. */
  pending?: { step: BoundStep; gate: "input" | "confirm" | "pay"; requirements?: PaymentRequirements };
}

let counter = 0;
const newID = () => `demo-${counter++}`;

function doc(title: string, elements: DynamicUIElement[]): DynamicUIDocument {
  return { id: { rawValue: newID() }, createdAt: "", title, elements, parentArtifactIDs: [], metadata: {} };
}

function capability(id: string): DemoCapability {
  const cap = travelCard.capabilities.find((c) => c.capabilityID === id);
  if (!cap) throw new Error(`unknown capability ${id}`);
  return cap;
}

function missingRequired(cap: DemoCapability, args: Record<string, JSONValue>): string[] {
  const schema = cap.inputSchema as any;
  const required: string[] = schema?.required ?? [];
  return required.filter((k) => args[k] === undefined || args[k] === "");
}

// ---- $ref binding (mirror of the Swift orchestrator) ----

export function resolveRefs(value: JSONValue, outputs: Record<string, JSONValue>): JSONValue {
  if (Array.isArray(value)) return value.map((v) => resolveRefs(v, outputs));
  if (value && typeof value === "object") {
    const keys = Object.keys(value);
    if (keys.length === 1 && keys[0] === "$ref" && typeof (value as any).$ref === "string") {
      return lookup((value as any).$ref, outputs) ?? null;
    }
    const out: Record<string, JSONValue> = {};
    for (const k of keys) out[k] = resolveRefs((value as any)[k], outputs);
    return out;
  }
  return value;
}

export function lookup(path: string, outputs: Record<string, JSONValue>): JSONValue | null {
  let current: JSONValue = outputs as JSONValue;
  for (const part of path.split(".")) {
    if (Array.isArray(current)) {
      const i = Number(part);
      if (!Number.isInteger(i) || i < 0 || i >= current.length) return null;
      current = current[i];
    } else if (current && typeof current === "object") {
      if (!(part in (current as object))) return null;
      current = (current as any)[part];
    } else {
      return null;
    }
  }
  return current;
}

// ---- Entry + gates ----

/** Enter the service: verify identity (mock) and render the zoomable card. */
export function enterTravel(zoom: SurfaceZoom = "summary"): DemoOutcome {
  const card = { ...travelCard, identity: travelCard.identity ? { ...travelCard.identity, verified: true } : undefined };
  return {
    document: buildServiceCardSurface(card, zoom),
    provenance: [
      { kind: "identity", detail: `verified ${card.identity?.scheme}:${card.identity?.id}` },
      { kind: "serviceCard", detail: `entered ${card.name} @ ${zoom}` },
    ],
  };
}

/** Follow a step with bound args, applying gates in order. */
export function followStep(step: BoundStep): DemoOutcome {
  const cap = capability(step.capabilityID);

  const missing = missingRequired(cap, step.args);
  if (missing.length) {
    return {
      document: doc(cap.title, [
        { type: "text", text: "I need a couple of details." },
        {
          type: "form",
          id: cap.capabilityID,
          title: cap.title,
          fields: missing.map((k) => ({ id: k, label: k, type: "text", required: true, options: [], voicePrompt: `Say the ${k}` })),
        },
      ]),
      provenance: [{ kind: "elicitation", detail: `missing: ${missing.join(", ")}` }],
      pending: { step, gate: "input" },
    };
  }

  if (cap.requiresConfirmation) {
    return {
      document: doc(`Confirm: ${cap.title}`, [
        { type: "question", id: cap.capabilityID, prompt: `${cap.title}? This is a ${cap.declaredRisk} action.`, kind: "yesNo" },
      ]),
      provenance: [{ kind: "policy", detail: `${cap.declaredRisk} → requireConfirmation` }],
      pending: { step, gate: "confirm" },
    };
  }

  return runResult(cap, step, false);
}

export function approveStep(step: BoundStep): DemoOutcome {
  const out = runResult(capability(step.capabilityID), step, false);
  out.provenance.unshift({ kind: "approval", detail: `retained approval for ${step.capabilityID}` });
  return out;
}

export function payStep(step: BoundStep): DemoOutcome {
  const cap = capability(step.capabilityID);
  const out = runResult(cap, step, true);
  out.provenance.unshift({ kind: "paymentReceipt", detail: `paid ${cap.price?.amount} ${cap.price?.currency?.toUpperCase()} · rail=card` });
  return out;
}

export function provideInputStep(step: BoundStep, extra: Record<string, JSONValue>): DemoOutcome {
  return followStep({ ...step, args: { ...step.args, ...extra } });
}

function runResult(cap: DemoCapability, step: BoundStep, paid: boolean): DemoOutcome {
  const result = mockInvoke(cap.capabilityID, step.args as JSONValue, paid);

  if (result.paymentRequired) {
    const p = result.paymentRequired;
    return {
      document: doc(`Payment required: ${cap.title}`, [
        {
          type: "payment",
          id: cap.capabilityID,
          title: cap.title,
          detail: `This capability is paid. Authorize ${p.price.amount} ${p.price.currency.toUpperCase()} to continue.`,
          price: p.price,
          rails: p.rails,
        },
      ]),
      provenance: [{ kind: "payment", detail: `402 · ${p.price.amount} ${p.price.currency.toUpperCase()}` }],
      pending: { step, gate: "pay", requirements: p },
    };
  }

  const body = result.ok ? JSON.stringify(result.data) : result.error ?? "failed";
  return {
    document: doc(cap.title, [{ type: "card", title: cap.title, body, metadata: {} }]),
    provenance: [{ kind: "toolCall", detail: `${cap.rel} ok=${result.ok}` }, { kind: "surface", detail: "result retained" }],
    output: result.ok ? result.data : undefined,
  };
}
