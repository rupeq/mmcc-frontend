import { createContext } from "react";

import { z } from "zod";

import { simulationsSearchSchema } from "@/features/simulations/schemas";
import type { zSimulationConfigurationInfo } from "@/lib/api";

interface SimulationsFiltersContextValue {
  search: string;
  reportStatus?: z.infer<typeof simulationsSearchSchema>["reportStatus"];
  showArchived?: true;
  simulations: Array<z.infer<typeof zSimulationConfigurationInfo>>;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  setSearch: (search: string) => void;
  setReportStatus: (
    status: z.infer<typeof simulationsSearchSchema>["reportStatus"],
  ) => void;
  setShowArchived: (showArchived?: true) => void;
  clearFilters: () => void;
  loadMore: () => void;
}

export const SimulationsFiltersContext =
  createContext<SimulationsFiltersContextValue>(
    {} as SimulationsFiltersContextValue,
  );
