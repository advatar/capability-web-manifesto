import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

const NAV = [
  { href: "/#proposal", label: "Proposal" },
  { href: "/#contract", label: "Contract" },
  { href: "/#identity", label: "Identity" },
  { href: "/#architecture", label: "Architecture" },
  { href: "/#evidence", label: "Evidence" },
  { href: "/#questions", label: "Questions" },
  { href: "/demo", label: "Demo" },
] as const;

const BRIEFING = "/docs/tim-berners-lee-briefing.md";
const CONTRACT = "/docs/hyperactive-web-v0.1.md";
const RFC_DRAFT = "/docs/draft-hyperactive-web-00.md";
const V02_PROFILE = "/docs/hyperactive-web-v0.2-identity-provenance.md";
const IDENTITY_BRIEFING = "/docs/identity-provenance-briefing.md";
const FIXTURES = "/conformance/v0.1/fixtures/manifest.json";

function Layout({ children }: { children: ReactNode }) {
  const [isDark, setDark] = useState(true);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  const toggleTheme = () => {
    const next = !isDark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // Storage can be unavailable in privacy-restricted browsing contexts.
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#page-content"
        className="fixed left-4 top-4 z-50 -translate-y-24 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b hairline bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-6 py-3 lg:px-10">
          <Link
            to="/"
            className="flex min-w-0 items-center gap-2.5 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span
              aria-hidden
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: "var(--gradient-accent)" }}
            />
            <span className="truncate font-mono text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground sm:text-[0.72rem]">
              Hyperactive Web <span className="text-foreground/50">v0.1</span>
            </span>
          </Link>
          <nav
            aria-label="Primary"
            className="order-3 w-full overflow-x-auto sm:order-none sm:ml-auto sm:w-auto"
          >
            <ul className="flex min-w-max items-center gap-1">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    className="block rounded-md px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="ml-auto rounded-md border hairline px-2.5 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:ml-0"
          >
            {isDark ? "Light" : "Dark"}
          </button>
        </div>
      </header>

      <div id="page-content">{children}</div>

      <footer className="border-t hairline px-6 py-10 lg:px-10">
        <div className="mx-auto grid max-w-6xl gap-8 text-sm text-muted-foreground sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: "var(--gradient-accent)" }}
              />
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em]">
                Hyperactive Web v0.1
              </span>
            </div>
            <p className="mt-4 max-w-xl leading-relaxed">
              An open experiment in portable, agent-readable Web affordances. Implemented for
              review; not a W3C or IETF specification.
            </p>
          </div>
          <nav aria-label="Project resources">
            <ul className="flex flex-wrap gap-x-5 gap-y-3 sm:justify-end">
              {[
                ["Briefing", BRIEFING],
                ["Contract", CONTRACT],
                ["RFC draft", RFC_DRAFT],
                ["Identity + provenance v0.2", V02_PROFILE],
                ["HTTP provenance example", IDENTITY_BRIEFING],
                ["Fixtures", FIXTURES],
              ].map(([label, href]) => (
                <li key={label}>
                  <a
                    className="underline decoration-dotted underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {label}
                    <span aria-hidden> ↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Hyperactive Web v0.1 — A capability layer for the Web" },
      {
        name: "description",
        content:
          "A working experiment in portable, agent-readable Web affordances: normative v0.1 contract, Swift and TypeScript implementations, conformance fixtures, and a live demo.",
      },
      { name: "author", content: "UniversalInteractionKit project" },
      { name: "theme-color", content: "#090d1b" },
      { property: "og:title", content: "Hyperactive Web v0.1 — Let the Web say what can be done" },
      {
        property: "og:description",
        content:
          "Inspect a normative capability contract, two conforming runtime stacks, shared fixtures, a live demo, and the architectural questions still open.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://hyperactive.network/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Hyperactive Web v0.1 — A capability layer for the Web" },
      {
        name: "twitter:description",
        content:
          "Working code and a precise question: can invocable affordances become portable across agent protocols while authority stays local?",
      },
      { property: "og:image", content: "https://hyperactive.network/og-card.png" },
      { property: "og:image:alt", content: "The Capability Web — an open layer of the internet" },
      {
        name: "twitter:image",
        content: "https://hyperactive.network/og-card.png",
      },
      {
        name: "twitter:image:alt",
        content: "The Capability Web — an open layer of the internet",
      },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "canonical", href: "https://hyperactive.network/" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
    scripts: [
      {
        children:
          "try{var t=localStorage.getItem('theme');var d=t?t==='dark':true;if(d)document.documentElement.classList.add('dark');}catch(e){document.documentElement.classList.add('dark');}",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Layout>
        <Outlet />
      </Layout>
    </QueryClientProvider>
  );
}
