import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { api } from "@/lib/api";

export const useDeleteSimulationMutation = (
  options?: UseMutationOptions<void, AxiosError, string>,
) =>
  useMutation<void, AxiosError, string>({
    mutationFn: (simulationId: string) =>
      api.delete(`/api/v1/simulations/${simulationId}`).then(() => undefined),
    ...options,
  });
