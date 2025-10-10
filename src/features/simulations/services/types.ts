import { z } from "zod";

import { zGetSimulationsApiV1SimulationsGetData } from "@/lib/api";

export type SimulationsQueryParams = z.infer<
  typeof zGetSimulationsApiV1SimulationsGetData
>["query"];
