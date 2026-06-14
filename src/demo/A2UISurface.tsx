import { type FormEvent, type ReactNode, useState } from "react";
import type {
  CapabilityPrice,
  DynamicUIAffordance,
  DynamicUIDocument,
  DynamicUIElement,
  DynamicUIField,
  JSONValue,
  RiskLevel,
} from "./types";

export interface A2UISurfaceProps {
  document: DynamicUIDocument;
  /** Invoked when the user follows an affordance (the "button that acts"). */
  onFollow?: (affordance: DynamicUIAffordance) => void;
  /** Invoked when an elicitation form is submitted. */
  onSubmitForm?: (formID: string, values: Record<string, string>) => void;
  /** Invoked when a confirmation surface is approved. */
  onConfirm?: (id: string) => void;
  /** Invoked when a payment surface's Pay button is pressed. */
  onPay?: (id: string, price: CapabilityPrice) => void;
  /** Invoked when an agent question is answered (by voice or tap). */
  onAnswer?: (id: string, answer: string) => void;
  /** Start listening for a spoken answer to the given prompt. */
  onVoice?: (prompt: string) => void;
  /** The component id currently capturing voice, for UI feedback. */
  listeningFor?: string | null;
}

const RISK_COLOR: Record<RiskLevel, string> = {
  readOnly: "#2e7d32",
  lowImpactWrite: "#558b2f",
  externalCommunication: "#f9a825",
  financialOrLegal: "#e65100",
  credentialOrSecurity: "#c62828",
  unknown: "#616161",
};

function RiskBadge({ risk }: { risk: RiskLevel }): ReactNode {
  return (
    <span
      style={{
        fontSize: 11,
        padding: "1px 6px",
        borderRadius: 6,
        color: "#fff",
        background: RISK_COLOR[risk] ?? RISK_COLOR.unknown,
      }}
    >
      {risk}
    </span>
  );
}

function describe(value: JSONValue | undefined): string {
  if (value === undefined || value === null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value);
}

function FormElement({
  element,
  onSubmitForm,
}: {
  element: Extract<DynamicUIElement, { type: "form" }>;
  onSubmitForm?: A2UISurfaceProps["onSubmitForm"];
}): ReactNode {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const field of element.fields) initial[field.id] = describe(field.value);
    return initial;
  });

  const update = (id: string, v: string) => setValues((prev) => ({ ...prev, [id]: v }));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSubmitForm?.(element.id, values);
  };

  return (
    <form onSubmit={submit} style={card()}>
      <strong>{element.title}</strong>
      {element.fields.map((field) => (
        <label key={field.id} style={{ display: "block", margin: "8px 0" }}>
          <span style={{ fontSize: 13 }}>
            {field.label}
            {field.required ? " *" : ""}
          </span>
          <FieldInput field={field} value={values[field.id] ?? ""} onChange={(v) => update(field.id, v)} />
        </label>
      ))}
      <button type="submit" style={primaryButton()}>
        Continue
      </button>
    </form>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: DynamicUIField;
  value: string;
  onChange: (v: string) => void;
}): ReactNode {
  const common = { width: "100%", boxSizing: "border-box" as const, marginTop: 4 };
  switch (field.type) {
    case "toggle":
      return (
        <input
          type="checkbox"
          checked={value === "true"}
          onChange={(e) => onChange(e.target.checked ? "true" : "false")}
        />
      );
    case "number":
      return <input type="number" style={common} value={value} onChange={(e) => onChange(e.target.value)} />;
    case "date":
      return <input type="date" style={common} value={value} onChange={(e) => onChange(e.target.value)} />;
    case "picker":
      return (
        <select style={common} value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">—</option>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    default:
      return <input type="text" style={common} value={value} onChange={(e) => onChange(e.target.value)} />;
  }
}

function QuestionTextInput({ onSubmit }: { onSubmit: (value: string) => void }): ReactNode {
  const [value, setValue] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) onSubmit(value.trim());
      }}
      style={{ display: "flex", gap: 6 }}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type or speak…"
        style={{ padding: "6px 10px", borderRadius: 8 }}
      />
      <button type="submit" style={primaryButton()}>
        Answer
      </button>
    </form>
  );
}

function Element({
  element,
  props,
}: {
  element: DynamicUIElement;
  props: A2UISurfaceProps;
}): ReactNode {
  switch (element.type) {
    case "text":
      return <p style={{ margin: "8px 0" }}>{element.text}</p>;
    case "card":
      return (
        <div style={card()}>
          <strong>{element.title}</strong>
          {element.body ? <p style={{ margin: "6px 0 0" }}>{element.body}</p> : null}
        </div>
      );
    case "table":
      return (
        <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 13 }}>
          <thead>
            <tr>
              {element.columns.map((c) => (
                <th key={c} style={cell(true)}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {element.rows.map((row, i) => (
              <tr key={i}>
                {row.map((value, j) => (
                  <td key={j} style={cell(false)}>
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    case "form":
      return <FormElement element={element} onSubmitForm={props.onSubmitForm} />;
    case "confirmation":
      return (
        <div style={card()}>
          <strong>{element.title}</strong>
          <p style={{ margin: "6px 0" }}>{element.detail}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <RiskBadge risk={element.risk} />
            <button style={primaryButton()} onClick={() => props.onConfirm?.(element.id)}>
              Approve
            </button>
          </div>
        </div>
      );
    case "payment":
      return (
        <div style={card()}>
          <strong>{element.title}</strong>
          <p style={{ margin: "6px 0" }}>{element.detail}</p>
          <p style={{ margin: "2px 0", fontSize: 12, color: "#777" }}>
            Price: {element.price.amount} {element.price.currency.toUpperCase()}
            {element.rails.length ? ` · ${element.rails.join(", ")}` : ""}
          </p>
          <button style={primaryButton()} onClick={() => props.onPay?.(element.id, element.price)}>
            Pay {element.price.amount} {element.price.currency.toUpperCase()}
          </button>
        </div>
      );
    case "question": {
      const listening = props.listeningFor === element.id;
      return (
        <div style={card()}>
          <strong>{element.prompt}</strong>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            {element.kind === "yesNo" ? (
              <>
                <button style={primaryButton()} onClick={() => props.onAnswer?.(element.id, "yes")}>
                  Yes
                </button>
                <button style={affordanceButton()} onClick={() => props.onAnswer?.(element.id, "no")}>
                  No
                </button>
              </>
            ) : (
              <QuestionTextInput onSubmit={(v) => props.onAnswer?.(element.id, v)} />
            )}
            <button
              aria-label="Answer by voice"
              title="Answer by voice"
              onClick={() => props.onVoice?.(element.prompt)}
              style={{
                ...affordanceButton(),
                padding: "8px 12px",
                background: listening ? "#c62828" : undefined,
                color: listening ? "#fff" : undefined,
              }}
            >
              {listening ? "● Listening…" : "🎤 Speak"}
            </button>
          </div>
        </div>
      );
    }
    case "affordances":
      return (
        <div>
          <strong>{element.title}</strong>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
            {element.items.map((item) => (
              <button
                key={item.id}
                style={affordanceButton()}
                onClick={() => props.onFollow?.(item)}
                data-rel={item.rel}
              >
                <span style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                  <span>{item.title}</span>
                  <span style={{ fontSize: 11, color: "#777" }}>{item.rel}</span>
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {item.requiresConfirmation ? <span title="requires confirmation">🛡</span> : null}
                  <RiskBadge risk={item.risk} />
                  <span aria-hidden>›</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      );
  }
}

/** Renders any A2UI DynamicUIDocument — backend-produced or built locally. */
export function A2UISurface(props: A2UISurfaceProps): ReactNode {
  const { document } = props;
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h2 style={{ margin: 0 }}>{document.title}</h2>
      {document.elements.map((element, i) => (
        <Element key={i} element={element} props={props} />
      ))}
    </section>
  );
}

// Inline styles keep the renderer dependency-free and legacy-browser friendly.
function card(): React.CSSProperties {
  return { padding: 12, borderRadius: 12, background: "rgba(0,0,0,0.04)" };
}
function cell(header: boolean): React.CSSProperties {
  return {
    borderBottom: "1px solid rgba(0,0,0,0.1)",
    padding: "4px 8px",
    textAlign: "left",
    fontWeight: header ? 600 : 400,
  };
}
function primaryButton(): React.CSSProperties {
  return {
    marginTop: 8,
    padding: "6px 14px",
    borderRadius: 8,
    border: "none",
    background: "#1565c0",
    color: "#fff",
    cursor: "pointer",
  };
}
function affordanceButton(): React.CSSProperties {
  return {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.1)",
    background: "rgba(0,0,0,0.03)",
    cursor: "pointer",
    font: "inherit",
  };
}
