import { z } from "zod";

export const signInSearchSchema = z.object({
  email: z.string().optional(),
});
