import { type UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

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
}: GammaDistributionProps) => {
  const { t } = useTranslation(["simulations"]);

  return (
    <>
      <FormField
        control={form.control}
        name={`simulationParameters.${fieldPrefix}.k`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t(($) => $.distributions.parameters.shape)}</FormLabel>
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
            <FormLabel>{t(($) => $.distributions.parameters.scale)}</FormLabel>
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
};
