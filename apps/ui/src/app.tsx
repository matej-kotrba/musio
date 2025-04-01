import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
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
          <Suspense>{props.children}</Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
