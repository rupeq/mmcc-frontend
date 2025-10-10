import { z } from "zod";

import { zSignInRequestSchema } from "@/lib/api";

export type SignInRequest = z.infer<typeof zSignInRequestSchema>;

export interface SignInErrorResponse {
  detail: string;
}
