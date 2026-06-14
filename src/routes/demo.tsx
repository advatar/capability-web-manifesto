import { createFileRoute } from "@tanstack/react-router";
import App from "../demo/App";

// The travel demo is vendored from UniversalInteractionKit/Web (src + demo) so
// it ships live with this site at /demo. Keep src/demo/* in sync with UIK.

export const Route = createFileRoute("/demo")({
  component: DemoPage,
});

function DemoPage() {
  // The demo App uses light inline styling; force a light surface so its panels
  // and text keep proper contrast regardless of the site's (dark) theme.
  return (
    <div style={{ background: "#ffffff", color: "#1a1a1a", minHeight: "100vh" }}>
      <App />
    </div>
  );
}
