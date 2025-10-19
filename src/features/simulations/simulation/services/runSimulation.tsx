import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { z } from "zod";

import { api, zRunSimulationResponse } from "@/lib/api";

type RunSimulationResponse = z.infer<typeof zRunSimulationResponse>;

export const useRunSimulationMutation = (
  options?: UseMutationOptions<RunSimulationResponse, AxiosError, string>,
) =>
  useMutation<RunSimulationResponse, AxiosError, string>({
    mutationFn: (simulationId: string) =>
      api
        .post<RunSimulationResponse>(`/api/v1/simulations/${simulationId}/run`)
        .then((response) => response.data),
    ...options,
  });
