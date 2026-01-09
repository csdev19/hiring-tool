import type { QueryClient } from "@tanstack/react-query";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { Toaster } from "@interviews-tool/web-ui";

import Header from "../components/header";
// Import CSS directly - will be processed by Vite and injected automatically
import "../index.css";

export interface RouterAppContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Hiring Tool",
      },
    ],
  }),

  component: RootDocument,
});

// Critical CSS + Loading screen styles
// Values match the dark theme from @interviews-tool/web-ui/styles.css
const criticalCss = `
  :root {
    --background: oklch(14.5% 0 0);
    --foreground: oklch(98.5% 0 0);
    --primary: oklch(87% 0 0);
  }
  html, body {
    background-color: var(--background);
    color: var(--foreground);
    margin: 0;
    padding: 0;
  }

  /* Loading screen styles */
  #loading-screen {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(--background);
    transition: opacity 0.3s ease-out;
  }

  #loading-screen.hidden {
    opacity: 0;
    pointer-events: none;
  }

  #loading-screen svg {
    width: 48px;
    height: 48px;
    animation: spin 1s linear infinite;
  }

  #loading-screen .logo-text {
    margin-top: 16px;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--foreground);
    letter-spacing: -0.025em;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

// Inline script to hide loading screen after hydration
const hideLoadingScript = `
  window.addEventListener('load', function() {
    setTimeout(function() {
      var el = document.getElementById('loading-screen');
      if (el) el.classList.add('hidden');
      setTimeout(function() { if (el) el.remove(); }, 300);
    }, 100);
  });
`;

function RootDocument() {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: criticalCss }} />
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        {/* Loading screen - shows immediately, hides after hydration */}
        <div id="loading-screen">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
          </svg>
          <div className="logo-text">Hiring Tool</div>
        </div>
        <script dangerouslySetInnerHTML={{ __html: hideLoadingScript }} />

        <div className="min-h-svh">
          <Header />
          <main className="pt-12">
            <Outlet />
          </main>
        </div>
        <Toaster richColors />
        <TanStackRouterDevtools position="bottom-left" />
        <ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}
