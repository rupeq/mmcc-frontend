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

interface WeibullDistributionProps {
  form: UseFormReturn<CreateSimulationFormData>;
  fieldPrefix: "arrivalProcess" | "serviceProcess";
}

export const WeibullDistribution = ({
  form,
  fieldPrefix,
}: WeibullDistributionProps) => (
  <>
    <FormField
      control={form.control}
      name={`simulationParameters.${fieldPrefix}.k`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Shape (k)</FormLabel>
          <FormControl>
            <Input
              type="number"
              step="0.01"
              placeholder="e.g., 1.5"
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
      name={`simulationParameters.${fieldPrefix}.lambda_param`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Scale (λ)</FormLabel>
          <FormControl>
            <Input
              type="number"
              step="0.01"
              placeholder="e.g., 2.0"
              {...field}
              onChange={(e) => field.onChange(parseFloat(e.target.value))}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </>
);
