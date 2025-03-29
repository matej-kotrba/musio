import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import Nav from "./components/Nav";
import { Toaster } from "solid-toast";

console.log(import.meta.env.VITE_BACKEND_URL)

export default function App() {
  return (
    <Router
      root={(props) => (
        <>
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
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
