import { createFileRoute, redirect } from "@tanstack/react-router";

import { OptimizationView } from "@/features/simulations/optimization";
import { CookieUtils } from "@/lib/api";

const RouteComponent = () => <OptimizationView />;

export const Route = createFileRoute("/optimization/")({
  component: RouteComponent,
  beforeLoad: () => {
    if (!CookieUtils.isAuthenticated()) {
      throw redirect({ to: "/signin" });
    }
  },
});
