import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { api } from "@/lib/api";

import type { CreateSimulationRequest } from "./types";

interface CreateSimulationResponse {
  simulation_configuration_id: string;
  simulation_report_id: string;
  task_id: string;
}

export const useCreateSimulationMutation = (
  options?: UseMutationOptions<
    CreateSimulationResponse,
    AxiosError,
    CreateSimulationRequest
  >,
) =>
  useMutation<CreateSimulationResponse, AxiosError, CreateSimulationRequest>({
    mutationFn: (data) =>
      api
        .post<CreateSimulationResponse>("/api/v1/simulations", data)
        .then((response) => response.data),
    ...options,
  });
