import { createFileRoute } from "@tanstack/react-router";
import App from "../demo/App";

// The travel demo is vendored from UniversalInteractionKit/Web (src + demo) so
// it ships live with this site at /demo. Keep src/demo/* in sync with UIK.

export const Route = createFileRoute("/demo")({
  component: DemoPage,
});

function DemoPage() {
  return (
    <div className="border-t hairline">
      <App />
    </div>
  );
}
