import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";

import { getSimulationConfigurationQueryOptions } from "@/features/simulations/simulation";
import {
  getSimulationReportQueryOptions,
  ReportView,
} from "@/features/simulations/simulation/reports";
import { CookieUtils } from "@/lib/api";

const RouteComponent = () => {
  const { simulationId, reportId } = Route.useParams();

  const configQuery = useSuspenseQuery(
    getSimulationConfigurationQueryOptions(simulationId),
  );

  const reportQuery = useSuspenseQuery(
    getSimulationReportQueryOptions(simulationId, reportId),
  );

  return <ReportView simulation={configQuery.data} report={reportQuery.data} />;
};

export const Route = createFileRoute(
  "/simulations/$simulationId/reports/$reportId",
)({
  component: RouteComponent,
  beforeLoad: () => {
    if (!CookieUtils.isAuthenticated()) {
      throw redirect({ to: "/signin" });
    }
  },
  loader: ({ context, params }) => {
    const { simulationId, reportId } = params;
    context.queryClient.ensureQueryData(
      getSimulationConfigurationQueryOptions(simulationId),
    );
    context.queryClient.ensureQueryData(
      getSimulationReportQueryOptions(simulationId, reportId),
    );
  },
});
