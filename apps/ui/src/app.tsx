import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { ErrorBoundary, Suspense } from "solid-js";
import "./app.css";
import Nav from "./components/Nav";
import { Toaster } from "solid-toast";
import { MetaProvider } from "@solidjs/meta";

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "hsl(0 0% 26%)",
                color: "var(--foreground)",
              },
            }}
          />
          <Nav />
          <ErrorBoundary fallback={<WholePageErrorFallback />}>
            <Suspense>{props.children}</Suspense>
          </ErrorBoundary>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}

function WholePageErrorFallback() {
  return (
    <div class="text-6xl text-white font-bold text-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      Our services seem to be down 😭
    </div>
  );
}
