import { z } from "zod";

import { zCreateSimulationRequest } from "@/lib/api";

export const createSimulationSchema = zCreateSimulationRequest;

export type CreateSimulationFormData = z.input<typeof createSimulationSchema>;
