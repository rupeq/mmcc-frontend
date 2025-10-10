import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { api } from "@/lib/api";

import type { ErrorResponse, SignUpRequest, SignUpResponse } from "./types";

export const useSignUpMutation = (
  options?: UseMutationOptions<
    SignUpResponse,
    AxiosError<ErrorResponse>,
    SignUpRequest
  >,
) =>
  useMutation<SignUpResponse, AxiosError<ErrorResponse>, SignUpRequest>({
    mutationFn: (data: SignUpRequest) =>
      api
        .post<SignUpResponse>("/api/v1/authorization/signup", data)
        .then((response) => response.data),
    ...options,
  });
