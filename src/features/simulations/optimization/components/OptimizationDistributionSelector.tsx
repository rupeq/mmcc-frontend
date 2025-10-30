import { useState } from "react";

import { type UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import {
  EmpiricalDistribution,
  ExponentialDistribution,
  GammaDistribution,
  TruncatedNormalDistribution,
  UniformDistribution,
  WeibullDistribution,
} from "@/features/simulations/components/distributions";
import type { OptimizationRequestInput } from "@/features/simulations/optimization/schemas";

interface OptimizationDistributionSelectorProps {
  form: UseFormReturn<OptimizationRequestInput>;
  fieldPrefix: "arrivalProcess" | "serviceProcess";
  label: string;
}

export const OptimizationDistributionSelector = ({
  form,
  fieldPrefix,
  label,
}: OptimizationDistributionSelectorProps) => {
  const { t } = useTranslation(["simulations"]);
  const [dist, setDist] = useState(
    form.getValues(`base_request.${fieldPrefix}`),
  );

  const distributionOptions = [
    {
      value: "exponential",
      label: t(($) => $.distributions.types.exponential),
    },
    { value: "uniform", label: t(($) => $.distributions.types.uniform) },
    { value: "gamma", label: t(($) => $.distributions.types.gamma) },
    { value: "weibull", label: t(($) => $.distributions.types.weibull) },
    {
      value: "truncated_normal",
      label: t(($) => $.distributions.types.truncatedNormal),
    },
    { value: "empirical", label: t(($) => $.distributions.types.empirical) },
  ] as const;

  const handleDistributionChange = (value: string) => {
    if (value === "exponential") {
      const next = { distribution: "exponential", rate: 5 } as const;
      setDist(next);
      form.setValue(`base_request.${fieldPrefix}`, next);
    } else if (value === "uniform") {
      const next = { distribution: "uniform", a: 0, b: 5 } as const;
      setDist(next);
      form.setValue(`base_request.${fieldPrefix}`, next);
    } else if (value === "gamma") {
      const next = { distribution: "gamma", k: 2, theta: 1 } as const;
      setDist(next);
      form.setValue(`base_request.${fieldPrefix}`, next);
    } else if (value === "weibull") {
      const next = {
        distribution: "weibull",
        k: 1.5,
        lambda_param: 2,
      } as const;
      setDist(next);
      form.setValue(`base_request.${fieldPrefix}`, next);
    } else if (value === "truncated_normal") {
      const next = {
        distribution: "truncated_normal",
        mu: 5,
        sigma: 1,
        a: 0,
        b: undefined,
      } as const;
      setDist(next);
      form.setValue(`base_request.${fieldPrefix}`, next);
    } else if (value === "empirical") {
      const next = {
        distribution: "empirical",
        method: "inverse_transform",
        bandwidth: null,
      } as const;
      setDist({ ...next, data: [] });
      form.setValue(`base_request.${fieldPrefix}`, {
        ...next,
        data: [],
      });
    }
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name={`base_request.${fieldPrefix}.distribution`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Select
              onValueChange={handleDistributionChange}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select distribution type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {distributionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      {dist.distribution === "exponential" && (
        <ExponentialDistribution
          form={form as never}
          fieldPrefix={`base_request.${fieldPrefix}` as never}
        />
      )}
      {dist.distribution === "uniform" && (
        <UniformDistribution
          form={form as never}
          fieldPrefix={`base_request.${fieldPrefix}` as never}
        />
      )}
      {dist.distribution === "gamma" && (
        <GammaDistribution
          form={form as never}
          fieldPrefix={`base_request.${fieldPrefix}` as never}
        />
      )}
      {dist.distribution === "weibull" && (
        <WeibullDistribution
          form={form as never}
          fieldPrefix={`base_request.${fieldPrefix}` as never}
        />
      )}
      {dist.distribution === "truncated_normal" && (
        <TruncatedNormalDistribution
          form={form as never}
          fieldPrefix={`base_request.${fieldPrefix}` as never}
        />
      )}
      {dist.distribution === "empirical" && (
        <EmpiricalDistribution
          form={form as never}
          fieldPrefix={`base_request.${fieldPrefix}` as never}
        />
      )}
    </div>
  );
};
