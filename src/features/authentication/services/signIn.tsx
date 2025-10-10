import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { api } from "@/lib/api";

import type { ErrorResponse, SignInRequest } from "./types";

export const useSignInMutation = (
  options?: UseMutationOptions<void, AxiosError<ErrorResponse>, SignInRequest>,
) =>
  useMutation<void, AxiosError<ErrorResponse>, SignInRequest>({
    mutationFn: (data: SignInRequest) =>
      api.post("/api/v1/authorization/signin", data).then(() => undefined),
    ...options,
  });
