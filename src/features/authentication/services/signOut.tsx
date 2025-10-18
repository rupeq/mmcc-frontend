import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { api, CookieUtils } from "@/lib/api";

interface ErrorResponse {
  detail: string;
}

export const useSignOutMutation = (
  options?: UseMutationOptions<void, AxiosError<ErrorResponse>>,
) =>
  useMutation<void, AxiosError<ErrorResponse>>({
    mutationFn: () =>
      api.post("/api/v1/authorization/signout").then(() => {
        CookieUtils.clearAuthCookies();
      }),
    ...options,
  });
