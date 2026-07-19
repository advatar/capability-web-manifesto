import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { MarkdownDocument } from "../components/markdown-document";

const DOCUMENTS: Record<string, string> = {
  "draft-hyperactive-web-00": "RFC-style draft",
  "hyperactive-web-v0.1": "Hyperactive Web v0.1 contract",
  "hyperactive-web-v0.2-identity-provenance": "Identity and provenance v0.2 profile",
  "identity-provenance-briefing": "Identity and provenance HTTP briefing",
  "tim-berners-lee-briefing": "Standards-review briefing",
};

export const Route = createFileRoute("/docs/$slug")({
  component: MarkdownPage,
});

function MarkdownPage() {
  const { slug } = Route.useParams();
  const title = DOCUMENTS[slug];
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!title) return;
    let active = true;
    fetch(`/docs/${slug}.md`)
      .then((response) => {
        if (!response.ok) throw new Error("Document unavailable");
        return response.text();
      })
      .then((value) => { if (active) setMarkdown(value); })
      .catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [slug, title]);

  if (!title) return <DocumentError />;

  return (
    <main className="min-h-screen bg-background px-6 py-16 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-4xl">
        <Link to="/" className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground">
          ← Hyperactive Web
        </Link>
        <div className="mt-10 rounded-3xl border hairline bg-card/30 p-6 sm:p-10 lg:p-14">
          {markdown && !error ? <MarkdownDocument markdown={markdown} /> : (
            <p className="text-muted-foreground">{error ? "This document could not be loaded." : "Loading document…"}</p>
          )}
        </div>
      </div>
    </main>
  );
}

function DocumentError() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <h1 className="font-display text-4xl text-foreground">Document not found</h1>
        <p className="mt-4 text-muted-foreground">That public project resource does not exist.</p>
        <Link to="/" className="mt-7 inline-flex rounded-full border hairline px-5 py-3 text-sm text-foreground">Return home</Link>
      </div>
    </main>
  );
}
