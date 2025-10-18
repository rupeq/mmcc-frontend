import { type UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/components/ui";
import type { CreateSimulationFormData } from "@/features/simulations/schemas";

interface TruncatedNormalDistributionProps {
  form: UseFormReturn<CreateSimulationFormData>;
  fieldPrefix: "arrivalProcess" | "serviceProcess";
}

export const TruncatedNormalDistribution = ({
  form,
  fieldPrefix,
}: TruncatedNormalDistributionProps) => (
  <>
    <FormField
      control={form.control}
      name={`simulationParameters.${fieldPrefix}.mu`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Mean (μ)</FormLabel>
          <FormControl>
            <Input
              type="number"
              step="0.01"
              placeholder="e.g., 5.0"
              {...field}
              onChange={(e) => field.onChange(parseFloat(e.target.value))}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name={`simulationParameters.${fieldPrefix}.sigma`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Standard Deviation (σ)</FormLabel>
          <FormControl>
            <Input
              type="number"
              step="0.01"
              placeholder="e.g., 1.0"
              {...field}
              onChange={(e) => field.onChange(parseFloat(e.target.value))}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name={`simulationParameters.${fieldPrefix}.a`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Lower Bound (a)</FormLabel>
          <FormControl>
            <Input
              type="number"
              step="0.01"
              placeholder="e.g., 0.0"
              {...field}
              value={field.value ?? 0}
              onChange={(e) => {
                const value = e.target.value;
                field.onChange(value ? parseFloat(value) : 0);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name={`simulationParameters.${fieldPrefix}.b`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Upper Bound (b)</FormLabel>
          <FormControl>
            <Input
              type="number"
              step="0.01"
              placeholder="e.g., 10.0 (optional)"
              {...field}
              value={field.value ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                field.onChange(value ? parseFloat(value) : undefined);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </>
);
