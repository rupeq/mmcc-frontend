import { useInfiniteQuery } from "@tanstack/react-query";
import { z } from "zod";

import type { SimulationsQueryParams } from "@/features/simulations/services/types";
import { api, type zGetSimulationsResponse } from "@/lib/api";

export const getSimulationsQueryKeys = (query?: SimulationsQueryParams) =>
  ["simulations", query].filter(Boolean);

export const useSimulationsInfiniteQuery = (query?: SimulationsQueryParams) => {
  return useInfiniteQuery({
    queryKey: getSimulationsQueryKeys(query),
    queryFn: ({ pageParam = 1 }) =>
      api
        .get<z.infer<typeof zGetSimulationsResponse>>("/api/v1/simulations", {
          params: { ...query, page: pageParam },
        })
        .then((response) => response.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (
        !lastPage.items ||
        lastPage.items.length < (query?.limit ?? 0) ||
        (lastPage.total_pages && lastPageParam >= lastPage.total_pages)
      ) {
        return undefined;
      }

      return lastPageParam + 1;
    },
  });
};
