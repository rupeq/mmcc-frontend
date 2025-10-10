import { StrictMode, Suspense } from "react";
import ReactDOM from "react-dom/client";

import { RouterProvider } from "@tanstack/react-router";

import { FullPageSpinner } from "@/components/FullPageSpinner";
import { router } from "@/lib/tanstack";

import "./index.css";

import "./lib/i18n";

const rootElement = document.getElementById("root")!;

if (!rootElement) {
  throw new Error("Could not find root element");
}

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <Suspense fallback={<FullPageSpinner />}>
        <RouterProvider router={router} />
      </Suspense>
    </StrictMode>,
  );
}

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
