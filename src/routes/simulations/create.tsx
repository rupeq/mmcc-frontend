import { createFileRoute, redirect } from "@tanstack/react-router";

import { CreateSimulation } from "@/features/simulations/create";
import { CookieUtils } from "@/lib/api";

const RouteComponent = () => <CreateSimulation />;

export const Route = createFileRoute("/simulations/create")({
  component: RouteComponent,
  beforeLoad: () => {
    if (!CookieUtils.isAuthenticated()) {
      throw redirect({ to: "/signin" });
    }
  },
});
