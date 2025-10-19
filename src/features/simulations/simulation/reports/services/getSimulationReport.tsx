import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

import { api, zGetSimulationConfigurationReportResponse } from "@/lib/api";

export const getSimulationReportQueryOptions = (
  simulationId: string,
  reportId: string,
) =>
  queryOptions({
    queryKey: ["simulation", "report", simulationId, reportId],
    queryFn: () =>
      api
        .get<
          z.infer<typeof zGetSimulationConfigurationReportResponse>
        >(`/api/v1/simulations/${simulationId}/reports/${reportId}`)
        .then((response) => response.data),
  });
