import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

import { api, zGetSimulationConfigurationReportsResponse } from "@/lib/api";

export const getSimulationReportsQueryOptions = (simulationId: string) =>
  queryOptions({
    queryKey: ["simulation", "reports", simulationId],
    queryFn: () =>
      api
        .get<
          z.infer<typeof zGetSimulationConfigurationReportsResponse>
        >(`/api/v1/simulations/${simulationId}/reports`)
        .then((response) => response.data),
  });
