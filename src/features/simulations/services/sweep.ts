import {
  useMutation,
  type UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { z } from "zod";

import { api, zSweepRequest, zSweepResponse } from "@/lib/api";

type SweepRequest = z.infer<typeof zSweepRequest>;
export type SweepResponse = z.infer<typeof zSweepResponse>;

export const useStartSweepMutation = (
  options?: UseMutationOptions<SweepResponse, AxiosError, SweepRequest>,
) =>
  useMutation<SweepResponse, AxiosError, SweepRequest>({
    mutationFn: (data: SweepRequest) =>
      api
        .post<SweepResponse>("/api/v1/simulations/sweep", data)
        .then((response) => response.data),
    ...options,
  });

export const getSweepStatusQueryOptions = (batchId: string) => ({
  queryKey: ["sweep", "status", batchId],
  queryFn: () =>
    api
      .get<SweepResponse>(`/api/v1/simulations/sweep/${batchId}`)
      .then((response) => response.data),
  refetchInterval: 3000,
  refetchIntervalInBackground: true,
});

export const useSweepStatusQuery = (batchId: string | null, enabled = true) =>
  useQuery({
    ...getSweepStatusQueryOptions(batchId!),
    enabled: enabled && !!batchId,
  });
