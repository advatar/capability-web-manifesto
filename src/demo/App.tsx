import { useCallback, useEffect, useRef, useState } from "react";
import { A2UISurface } from "./A2UISurface";
import { useVoiceInput, speak, interpretYesNo } from "./useVoiceInput";
import type { DynamicUIDocument, JSONValue } from "./types";
import { mockPlan, livePlan, type DemoPlan, type DemoStep } from "./planner";

// Default to the mock planner (no secrets). Set VITE_LIVE_PLANNER=1 and run
// `npm run demo:server` (with OPENAI_API_KEY) to use the real ChatGPT planner.
const USE_LIVE = (import.meta as { env?: Record<string, string> }).env?.VITE_LIVE_PLANNER === "1";
const getPlan = (goal: string): Promise<DemoPlan> => (USE_LIVE ? livePlan(goal) : Promise.resolve(mockPlan(goal)));
import {
  approveStep,
  enterTravel,
  followStep,
  payStep,
  provideInputStep,
  resolveRefs,
  type BoundStep,
  type DemoOutcome,
  type ProvenanceEvent,
} from "./demoResolver";

const SAMPLES = [
  "Find a refundable hotel in Stockholm this weekend",
  "Get me the premium member rates in Stockholm",
  "Book the top hotel in Stockholm",
];

interface RunState {
  plan: DemoPlan;
  index: number;
  outputs: Record<string, JSONValue>;
  /** A clarifying question pending before the current step. */
  asking?: DemoStep;
}

export default function App() {
  const [goal, setGoal] = useState("");
  const [surface, setSurface] = useState<DynamicUIDocument | null>(null);
  const [pending, setPending] = useState<DemoOutcome["pending"]>();
  const [log, setLog] = useState<ProvenanceEvent[]>([]);
  const [listeningFor, setListeningFor] = useState<string | null>(null);
  const run = useRef<RunState | null>(null);
  const cardSurface = useRef<DynamicUIDocument>(enterTravel("summary").document);

  useEffect(() => setLog(enterTravel("summary").provenance), []);

  const present = useCallback((out: DemoOutcome, speakPrompt = true) => {
    setSurface(out.document);
    setPending(out.pending);
    setLog((prev) => [...out.provenance, ...prev].slice(0, 50));
    if (speakPrompt) {
      const q = out.document.elements.find((e) => e.type === "question") as any;
      if (q) speak(q.prompt);
    }
  }, []);

  const bound = (step: DemoStep, outputs: Record<string, JSONValue>): BoundStep => ({
    id: step.id,
    capabilityID: step.capabilityID,
    args: resolveRefs(step.args, outputs) as Record<string, JSONValue>,
  });

  // Run steps until a gate or completion, threading outputs across $refs.
  const drive = useCallback(
    (state: RunState) => {
      run.current = state;
      const { plan, index, outputs } = state;
      if (index >= plan.steps.length) {
        present({ document: { id: { rawValue: "done" }, createdAt: "", title: "Done", elements: [{ type: "text", text: "Plan complete." }], parentArtifactIDs: [], metadata: {} }, provenance: [{ kind: "workflowTrace", detail: `completed ${plan.steps.length} steps` }] }, false);
        return;
      }
      const step = plan.steps[index];

      // Clarifying question before the step (voice).
      if (step.ask && (step.args[step.ask.fills ?? ""] === undefined)) {
        run.current = { ...state, asking: step };
        present({
          document: { id: { rawValue: "ask" }, createdAt: "", title: step.capabilityID, elements: [{ type: "question", id: step.id, prompt: step.ask.prompt, kind: step.ask.kind }], parentArtifactIDs: [], metadata: {} },
          provenance: [{ kind: "question", detail: step.ask.prompt }],
        });
        return;
      }

      const out = followStep(bound(step, outputs));
      present(out);
      if (!out.pending) commit(out, state);
    },
    [present],
  );

  // A step finished: store its output and advance.
  const commit = useCallback(
    (out: DemoOutcome, state: RunState) => {
      const outputs = { ...state.outputs };
      if (out.output !== undefined) outputs[state.plan.steps[state.index].id] = out.output;
      drive({ ...state, index: state.index + 1, outputs, asking: undefined });
    },
    [drive],
  );

  const startGoal = useCallback(
    async (g: string) => {
      const trimmed = g.trim();
      if (!trimmed) return;
      setLog([]);
      try {
        const plan = await getPlan(trimmed);
        drive({ plan, index: 0, outputs: {} });
      } catch (err) {
        present({ document: { id: { rawValue: "err" }, createdAt: "", title: "Planner error", elements: [{ type: "text", text: String(err) }], parentArtifactIDs: [], metadata: {} }, provenance: [{ kind: "error", detail: "planner failed" }] }, false);
      }
    },
    [drive, present],
  );

  // Route a gate answer (voice or tap).
  const handleAnswer = useCallback(
    (_id: string, value: string) => {
      setListeningFor(null);
      const state = run.current;
      if (!state) return;

      // Clarifying question → fill the arg and re-drive the step.
      if (state.asking?.ask) {
        const step = state.asking;
        const filled: DemoStep = { ...step, args: { ...step.args, [step.ask!.fills ?? "value"]: value } };
        const plan = { ...state.plan, steps: state.plan.steps.map((s, i) => (i === state.index ? filled : s)) };
        drive({ ...state, plan, asking: undefined });
        return;
      }
      // Confirmation yes/no.
      if (pending?.gate === "confirm") {
        if (interpretYesNo(value) === "yes" || value === "yes") {
          const out = approveStep(pending.step);
          present(out, false);
          if (!out.pending) commit(out, state);
        } else {
          setLog((p) => [{ kind: "declined", detail: "user declined" }, ...p]);
          present({ document: { id: { rawValue: "x" }, createdAt: "", title: "Cancelled", elements: [{ type: "text", text: "Okay, cancelled." }], parentArtifactIDs: [], metadata: {} }, provenance: [] }, false);
        }
      }
    },
    [pending, drive, present, commit],
  );

  const voice = useVoiceInput((text) => {
    const state = run.current;
    if (!state) return;
    if (pending?.gate === "confirm") {
      const yn = interpretYesNo(text);
      if (yn) handleAnswer(pending.step.id, yn);
    } else {
      handleAnswer(state.asking?.id ?? "", text);
    }
  });

  const startVoice = useCallback(() => {
    setListeningFor(pending?.step.id ?? run.current?.asking?.id ?? "ask");
    voice.start();
  }, [pending, voice]);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <header style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0 }}>Hyperactive Web — Travel demo</h1>
        <p style={{ color: "#666", marginTop: 6 }}>
          A planner emits a multi-step plan; the runtime composes the steps ($ref binds one step's output into the
          next) and applies the gates — identity / elicitation / confirmation / payment — as A2UI surfaces.
          Questions are answerable by voice.{voice.supported ? "" : " (Voice not supported here.)"}
        </p>
      </header>

      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input
          style={{ flex: 1, padding: "10px 12px", borderRadius: 10, border: "1px solid #ccc" }}
          placeholder="Type a goal…"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && startGoal(goal)}
        />
        <button onClick={() => startGoal(goal)} style={btn(true)}>Plan & run</button>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 24 }}>
        {SAMPLES.map((s) => (
          <button key={s} onClick={() => { setGoal(s); startGoal(s); }} style={chip()}>{s}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <section style={panel()}><A2UISurface document={cardSurface.current} /></section>
          {surface && (
            <section style={panel()}>
              <A2UISurface
                document={surface}
                onAnswer={handleAnswer}
                onVoice={startVoice}
                onPay={() => {
                  const state = run.current;
                  if (!state || pending?.gate !== "pay") return;
                  const out = payStep(pending.step);
                  present(out, false);
                  if (!out.pending) commit(out, state);
                }}
                onSubmitForm={(_id, values) => {
                  const state = run.current;
                  if (!state || pending?.gate !== "input") return;
                  const out = provideInputStep(pending.step, values);
                  present(out, false);
                  if (!out.pending) commit(out, state);
                }}
                listeningFor={voice.listening ? listeningFor : null}
              />
              {voice.listening && <p style={{ color: "#c62828", fontSize: 13 }}>● Listening… "{voice.transcript}"</p>}
            </section>
          )}
        </div>

        <aside style={{ ...panel(), position: "sticky", top: 16 }}>
          <h3 style={{ marginTop: 0 }}>Provenance</h3>
          <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {log.map((e, i) => (
              <li key={i} style={{ fontSize: 13 }}>
                <span style={{ fontFamily: "monospace", color: "#1565c0" }}>{e.kind}</span>
                <span style={{ color: "#555" }}> · {e.detail}</span>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}

function panel(): React.CSSProperties {
  return { border: "1px solid #e3e3e3", borderRadius: 16, padding: 18, background: "#fafafa" };
}
function btn(primary: boolean): React.CSSProperties {
  return { padding: "10px 16px", borderRadius: 10, border: "none", cursor: "pointer", background: primary ? "#1565c0" : "#eee", color: primary ? "#fff" : "#222" };
}
function chip(): React.CSSProperties {
  return { padding: "6px 12px", borderRadius: 999, border: "1px solid #ddd", background: "#fff", cursor: "pointer", fontSize: 13 };
}
