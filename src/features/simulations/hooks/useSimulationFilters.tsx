import { useState } from "react";

import { useDebouncedValue } from "@tanstack/react-pacer";
import { z } from "zod";

import { simulationsSearchSchema } from "@/features/simulations/schemas";
import { useSimulationsInfiniteQuery } from "@/features/simulations/services";

const SEARCH_COLUMNS = ["id", "name", "description"];
const SEARCH_DEBOUNCE_MS = 500;
const PAGE_LIMIT = 20;

export const useSimulationFilters = (
  defaultFilters?: z.infer<typeof simulationsSearchSchema>,
) => {
  const [search, setSearch] = useState<string>(defaultFilters?.search ?? "");
  const [reportStatus, setReportStatus] = useState<
    z.infer<typeof simulationsSearchSchema>["reportStatus"]
  >(defaultFilters?.reportStatus);
  const [showArchived, setShowArchived] = useState<true | undefined>(
    defaultFilters?.showArchived,
  );

  const [debouncedSearch] = useDebouncedValue(search, {
    wait: search === "" ? 0 : SEARCH_DEBOUNCE_MS,
  });

  const buildFilterString = (): string => {
    const filters: string[] = [];

    if (debouncedSearch) {
      const searchFilter = SEARCH_COLUMNS.map(
        (column) => `${column}:${debouncedSearch}`,
      ).join(",");
      filters.push(searchFilter);
    }

    if (reportStatus) {
      filters.push(`report_status:${reportStatus}`);
    }

    if (!showArchived) {
      filters.push("is_active:true");
    }

    return filters.filter(Boolean).join(",");
  };

  const simulationsQuery = useSimulationsInfiniteQuery({
    filters: buildFilterString() || undefined,
    columns: SEARCH_COLUMNS,
    limit: PAGE_LIMIT,
  });

  const simulations =
    simulationsQuery.data?.pages.flatMap((page) => page.items) ?? [];

  return {
    search,
    reportStatus,
    showArchived,
    simulations,
    simulationsQuery,
    setSearch,
    setReportStatus,
    setShowArchived,
  };
};
