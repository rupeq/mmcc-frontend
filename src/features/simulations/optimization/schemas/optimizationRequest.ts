import { z } from "zod";

import { zSimulationRequestInput } from "@/lib/api";

export const optimizationBaseSchema = z.object({
  base_request: zSimulationRequestInput,
  optimizationType: z.enum([
    "binary_search",
    "cost_minimization",
    "gradient_descent",
    "multi_objective",
  ]),
});

export const binarySearchSchema = optimizationBaseSchema.extend({
  optimizationType: z.literal("binary_search"),
  targetRejectionProb: z.number().min(0).max(1),
  maxChannels: z.number().int().min(1).max(1000).optional(),
  tolerance: z.number().min(0).max(1).optional(),
});

export const costMinimizationSchema = optimizationBaseSchema.extend({
  optimizationType: z.literal("cost_minimization"),
  channelCost: z.number().min(0),
  rejectionPenalty: z.number().min(0),
  maxChannels: z.number().int().min(1).max(1000).optional(),
});

export const gradientDescentSchema = optimizationBaseSchema.extend({
  optimizationType: z.literal("gradient_descent"),
  channelCost: z.number().min(0).optional(),
  rejectionPenalty: z.number().min(0).optional(),
  maxChannels: z.number().int().min(1).max(1000).optional(),
});

export const multiObjectiveSchema = optimizationBaseSchema.extend({
  optimizationType: z.literal("multi_objective"),
  rejectionWeight: z.number().min(0).max(1),
  utilizationWeight: z.number().min(0).max(1),
  costWeight: z.number().min(0).max(1),
  channelCost: z.number().min(0),
  rejectionPenalty: z.number().min(0),
  maxChannels: z.number().int().min(1).max(1000).optional(),
});

export const optimizationRequestSchema = z.discriminatedUnion(
  "optimizationType",
  [
    binarySearchSchema,
    costMinimizationSchema,
    gradientDescentSchema,
    multiObjectiveSchema,
  ],
);

export type OptimizationRequestInput = z.input<
  typeof optimizationRequestSchema
>;
export type OptimizationRequest = z.output<typeof optimizationRequestSchema>;
