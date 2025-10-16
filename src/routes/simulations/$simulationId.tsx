import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";

import {
  getSimulationConfigurationQueryOptions,
  getSimulationReportsQueryOptions,
  SimulationView,
} from "@/features/simulations/simulation";
import { CookieUtils } from "@/lib/api";

const RouteComponent = () => {
  const { simulationId } = Route.useParams();

  const configQuery = useSuspenseQuery(
    getSimulationConfigurationQueryOptions(simulationId),
  );
  const reportsQuery = useSuspenseQuery(
    getSimulationReportsQueryOptions(simulationId),
  );

  return (
    <SimulationView
      simulation={configQuery.data}
      reports={reportsQuery.data.reports}
    />
  );
};

export const Route = createFileRoute("/simulations/$simulationId")({
  component: RouteComponent,
  beforeLoad: () => {
    if (!CookieUtils.isAuthenticated()) {
      throw redirect({ to: "/signin" });
    }
  },
  loader: ({ context, params }) => {
    const { simulationId } = params;

    context.queryClient.ensureQueryData(
      getSimulationConfigurationQueryOptions(simulationId),
    );
    context.queryClient.ensureQueryData(
      getSimulationReportsQueryOptions(simulationId),
    );
  },
});
