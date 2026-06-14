// Mock planner: maps a natural-language goal to a multi-step plan, standing in
// for a ChatGPT function-calling call that emits a CapabilityPlan. Swap
// `mockPlan` for `livePlan` (fetch a server proxy holding OPENAI_API_KEY).

import type { JSONValue } from "./types";

export interface DemoStep {
  id: string;
  capabilityID: string;
  args: Record<string, JSONValue>;
  /** Optional clarifying question to ask first (voice). */
  ask?: { prompt: string; kind: "yesNo" | "text"; fills?: string };
}

export interface DemoPlan {
  goal: string;
  steps: DemoStep[];
}

export function mockPlan(goal: string): DemoPlan {
  const g = goal.toLowerCase();
  const city = /stockholm/.test(g) ? "Stockholm" : /lisbon/.test(g) ? "Lisbon" : /oslo/.test(g) ? "Oslo" : "";
  const ask = city ? undefined : { prompt: "Which city should I search?", kind: "text" as const, fills: "city" };

  // book / reserve → search, then book the top result (composed via $ref).
  if (/book|reserve/.test(g)) {
    return {
      goal,
      steps: [
        { id: "search", capabilityID: "hotel_search", args: city ? { city } : {}, ask },
        { id: "book", capabilityID: "book_hotel", args: { hotelID: { $ref: "search.results.0.id" } } },
      ],
    };
  }
  // premium / member rates → search, then unlock premium rates (402-gated).
  if (/premium|member|cheaper|best rate/.test(g)) {
    return {
      goal,
      steps: [
        { id: "search", capabilityID: "hotel_search", args: city ? { city } : {}, ask },
        { id: "premium", capabilityID: "premium_rates", args: {} },
      ],
    };
  }
  // default → just search.
  return { goal, steps: [{ id: "search", capabilityID: "hotel_search", args: city ? { city } : {}, ask }] };
}

export async function livePlan(goal: string): Promise<DemoPlan> {
  const res = await fetch("/api/plan", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ goal }),
  });
  if (!res.ok) throw new Error(`planner ${res.status}`);
  return (await res.json()) as DemoPlan;
}
