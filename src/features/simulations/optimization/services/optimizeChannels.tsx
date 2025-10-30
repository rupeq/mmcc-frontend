import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { z } from "zod";

import { api, zOptimizationResultResponse } from "@/lib/api";

import type { OptimizationRequestInput } from "../schemas";

export type OptimizationResult = z.infer<typeof zOptimizationResultResponse>;

export const useOptimizeChannelsMutation = (
  options?: UseMutationOptions<
    OptimizationResult,
    AxiosError,
    OptimizationRequestInput
  >,
) =>
  useMutation<OptimizationResult, AxiosError, OptimizationRequestInput>({
    mutationFn: (data) =>
      api
        .post<OptimizationResult>("/api/v1/simulations/optimize", data)
        .then((response) => response.data),
    ...options,
  });
