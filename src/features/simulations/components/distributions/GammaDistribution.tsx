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

interface GammaDistributionProps {
  form: UseFormReturn<CreateSimulationFormData>;
  fieldPrefix: "arrivalProcess" | "serviceProcess";
}

export const GammaDistribution = ({
  form,
  fieldPrefix,
}: GammaDistributionProps) => (
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
              placeholder="e.g., 2.0"
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
      name={`simulationParameters.${fieldPrefix}.theta`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Scale (θ)</FormLabel>
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
  </>
);
