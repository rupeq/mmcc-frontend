import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

import { api, zServiceTimeVisualizationsResponse } from "@/lib/api";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const zTemporalChartsResponse = z.object({
  utilization_timeseries: z.string(),
  phase_comparison: z.string().optional(),
  busy_idle_distributions: z.string(),
});

export const getServiceTimeVisualizationsQueryOptions = (
  simulationId: string,
  reportId: string,
  enabled: boolean = true,
) =>
  queryOptions({
    queryKey: ["simulation", "report", simulationId, reportId, "charts"],
    queryFn: () =>
      api
        .get<
          z.infer<typeof zServiceTimeVisualizationsResponse>
        >(`/api/v1/simulations/${simulationId}/reports/${reportId}/service-time-visualizations`)
        .then((response) => response.data),
    enabled,
    staleTime: Infinity,
  });

export const getGanttChartBlob = (simulationId: string, reportId: string) =>
  api
    .get<Blob>(
      `/api/v1/simulations/${simulationId}/reports/${reportId}/gantt`,
      {
        responseType: "blob",
      },
    )
    .then((response) => response.data);

export const getTemporalChartsQueryOptions = (
  simulationId: string,
  reportId: string,
  enabled: boolean = true,
) =>
  queryOptions({
    queryKey: [
      "simulation",
      "report",
      simulationId,
      reportId,
      "temporal-charts",
    ],
    queryFn: () =>
      api
        .get<
          z.infer<typeof zTemporalChartsResponse>
        >(`/api/v1/simulations/${simulationId}/reports/${reportId}/temporal-charts`)
        .then((response) => response.data),
    enabled,
    staleTime: Infinity,
  });
