import { useState } from "react";

import { useDebouncedValue } from "@tanstack/react-pacer";
import { useNavigate } from "@tanstack/react-router";

import { useSimulationsInfiniteQuery } from "@/features/simulations/services";

const columns = ["id", "name", "description"];

export const useSimulationsSearch = (defaultSearch?: string) => {
  const [search, setSearch] = useState<string>(defaultSearch ?? "");
  const [debouncedSearch] = useDebouncedValue(search, { wait: 500 });

  const navigate = useNavigate({ from: "/" });

  const simulationsQuery = useSimulationsInfiniteQuery({
    filters: debouncedSearch
      ? columns.map((column) => `${column}:${debouncedSearch}`).join(",")
      : undefined,
    columns,
    limit: 20,
  });

  const updateUrl = (newSearch: string) => {
    navigate({
      search: (prev) => ({ ...prev, search: newSearch || undefined }),
    });
  };

  const handleSearchChange = (newSearch: string) => {
    updateUrl(newSearch);
    setSearch(newSearch);
  };

  const simulations =
    simulationsQuery.data?.pages.flatMap((page) => page.items) ?? [];

  return {
    search,
    simulations,
    simulationsQuery,
    handleSearchChange,
  };
};
