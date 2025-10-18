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

interface ExponentialDistributionProps {
  form: UseFormReturn<CreateSimulationFormData>;
  fieldPrefix: "arrivalProcess" | "serviceProcess";
}

export const ExponentialDistribution = ({
  form,
  fieldPrefix,
}: ExponentialDistributionProps) => (
  <FormField
    control={form.control}
    name={`simulationParameters.${fieldPrefix}.rate`}
    render={({ field }) => (
      <FormItem>
        <FormLabel>Rate (λ)</FormLabel>
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
);
