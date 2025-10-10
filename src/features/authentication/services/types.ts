import { z } from "zod";

import {
  zSignInRequestSchema,
  zSignUpRequestSchema,
  zSignUpResponseSchema,
} from "@/lib/api";

export type SignInRequest = z.infer<typeof zSignInRequestSchema>;

export type SignUpRequest = z.infer<typeof zSignUpRequestSchema>;

export type SignUpResponse = z.infer<typeof zSignUpResponseSchema>;

export interface ErrorResponse {
  detail: string;
}
