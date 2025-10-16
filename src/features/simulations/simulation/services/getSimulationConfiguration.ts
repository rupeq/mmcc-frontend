import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

import { api, zGetSimulationConfigurationResponse } from "@/lib/api";

export const getSimulationConfigurationQueryOptions = (simulationId: string) =>
  queryOptions({
    queryKey: ["simulation", "configuration", simulationId],
    queryFn: () =>
      api
        .get<
          z.infer<typeof zGetSimulationConfigurationResponse>
        >(`/api/v1/simulations/${simulationId}`)
        .then((response) => response.data),
  });
