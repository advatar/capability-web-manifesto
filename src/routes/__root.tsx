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
  { to: "/", label: "Home" },
  { to: "/protocols", label: "Protocols" },
  { to: "/x403", label: "x403" },
  { to: "/humancard", label: "HumanCard" },
  { to: "/capabilities", label: "Capabilities" },
  { to: "/you", label: "You" },
  { to: "/browser", label: "Browser" },
  { to: "/demo", label: "Demo" },
] as const;

function Layout({ children }: { children: ReactNode }) {
  const [isDark, setDark] = useState(true);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  const toggleTheme = () => {
    const next = !isDark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b hairline bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3 lg:px-10">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: "var(--gradient-accent)" }} />
            <span className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-muted-foreground">
              The Hyperactive Web
            </span>
          </Link>
          <nav className="hidden sm:block">
            <ul className="flex items-center gap-1">
              {NAV.map((n) => (
                <li key={n.to}>
                  <Link
                    to={n.to}
                    activeOptions={{ exact: n.to === "/" }}
                    className="rounded-md px-2.5 py-1.5 text-xs transition-colors"
                    activeProps={{ className: "text-foreground" }}
                    inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-md border hairline px-2.5 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
          >
            {isDark ? "Light" : "Dark"}
          </button>
        </div>
      </header>

      {children}

      <footer className="border-t hairline px-6 py-10 lg:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--gradient-accent)" }} />
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em]">The Hyperactive Web</span>
          </div>
          <div className="italic">An open web of capabilities, with a place in it for you.</div>
          <div className="text-xs">Products will be built on this commons. The commons is for everyone.</div>
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
      { title: "The Hyperactive Web / Web4 — An open capability layer" },
      {
        name: "description",
        content:
          "A founding document for the Hyperactive Web / Web4: an open capability layer where the hyperlink grows up into a capability link, profiles make principals discoverable, and every person can be represented, remembered, and in control.",
      },
      { name: "author", content: "The Hyperactive Web" },
      { property: "og:title", content: "The Hyperactive Web / Web4 — An open capability layer" },
      {
        property: "og:description",
        content:
          "The web was a library of documents you could read. The Hyperactive Web / Web4 is a fabric of capabilities and profile-specific Service Cards you can invoke — the same internet, one layer up.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "The Hyperactive Web / Web4 — An open capability layer" },
      { name: "description", content: "Explains The Hyperactive Web, an open internet layer for invoking actions, not just reading documents." },
      { property: "og:description", content: "Explains The Hyperactive Web, an open internet layer for invoking actions, not just reading documents." },
      { name: "twitter:description", content: "Explains The Hyperactive Web, an open internet layer for invoking actions, not just reading documents." },
      { property: "og:image", content: "https://capability-web-manifesto.lovable.app/og-card.png" },
      { name: "twitter:image", content: "https://capability-web-manifesto.lovable.app/og-card.png" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/favicon.png" },
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
