import { createContext } from "react";

import { z } from "zod";

import type { zSimulationConfigurationInfo } from "@/lib/api";

interface SimulationsSearchContext {
  simulations: Array<z.infer<typeof zSimulationConfigurationInfo>>;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
}

export const SimulationsSearchContext = createContext<SimulationsSearchContext>(
  {} as SimulationsSearchContext,
);
