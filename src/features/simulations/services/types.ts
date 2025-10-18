import { z } from "zod";

import {
  zCreateSimulationRequest,
  zGetSimulationsApiV1SimulationsGetData,
} from "@/lib/api";

export type SimulationsQueryParams = z.infer<
  typeof zGetSimulationsApiV1SimulationsGetData
>["query"];

export type CreateSimulationRequest = z.infer<typeof zCreateSimulationRequest>;
