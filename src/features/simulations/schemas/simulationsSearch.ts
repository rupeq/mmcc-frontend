import { z } from "zod";

export const simulationsSearchSchema = z.object({
  search: z.string().optional(),
});
