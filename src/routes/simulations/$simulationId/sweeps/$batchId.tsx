import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";

import { getSweepStatusQueryOptions } from "@/features/simulations";
import { getSimulationConfigurationQueryOptions } from "@/features/simulations/simulation";
import { SweepView } from "@/features/simulations/simulation/sweeps/components/SweepView";
import { CookieUtils } from "@/lib/api";

const RouteComponent = () => {
  const { simulationId, batchId } = Route.useParams();

  const configQuery = useSuspenseQuery(
    getSimulationConfigurationQueryOptions(simulationId),
  );

  const sweepQuery = useSuspenseQuery({
    ...getSweepStatusQueryOptions(batchId),
    refetchInterval: (query) => {
      const isComplete =
        query.state.data &&
        query.state.data.completed + query.state.data.failed ===
          query.state.data.total_parameter_values;
      return isComplete ? false : 3000;
    },
  });

  return (
    <SweepView
      sweep={sweepQuery.data}
      simulationId={simulationId}
      configName={configQuery.data.name}
    />
  );
};

export const Route = createFileRoute(
  "/simulations/$simulationId/sweeps/$batchId",
)({
  component: RouteComponent,
  beforeLoad: () => {
    if (!CookieUtils.isAuthenticated()) {
      throw redirect({ to: "/signin" });
    }
  },
  loader: ({ context, params }) => {
    const { simulationId, batchId } = params;
    context.queryClient.ensureQueryData(
      getSimulationConfigurationQueryOptions(simulationId),
    );
    context.queryClient.ensureQueryData(getSweepStatusQueryOptions(batchId));
  },
});
