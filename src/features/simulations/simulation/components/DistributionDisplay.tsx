import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import type {
  zEmpiricalParams,
  zExponentialParams,
  zGammaParams,
  zTruncatedNormalParams,
  zUniformParams,
  zWeibullParams,
} from "@/lib/api";

type DistributionParams =
  | z.infer<typeof zExponentialParams>
  | z.infer<typeof zUniformParams>
  | z.infer<typeof zGammaParams>
  | z.infer<typeof zWeibullParams>
  | z.infer<typeof zTruncatedNormalParams>
  | z.infer<typeof zEmpiricalParams>;

interface Props {
  title: string;
  description?: string;
  distribution: DistributionParams;
}

const ParameterRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) => (
  <div className="flex justify-between items-center py-2 border-b last:border-0">
    <span className="text-sm font-medium text-muted-foreground">{label}</span>
    <span className="text-sm font-mono">
      {value !== null && value !== undefined ? value : "N/A"}
    </span>
  </div>
);

export const DistributionDisplay = ({
  title,
  description,
  distribution,
}: Props) => {
  const getDistributionName = (type: string) => {
    const names: Record<string, string> = {
      exponential: "Exponential",
      uniform: "Uniform",
      gamma: "Gamma",
      weibull: "Weibull",
      truncated_normal: "Truncated Normal",
      empirical: "Empirical",
    };
    return names[type] || type;
  };

  const renderParameters = () => {
    switch (distribution.distribution) {
      case "exponential":
        return (
          <ParameterRow
            label="Rate (λ)"
            value={
              "rate" in distribution ? distribution.rate.toFixed(4) : undefined
            }
          />
        );

      case "uniform":
        return (
          <>
            <ParameterRow
              label="Lower Bound (a)"
              value={
                "a" in distribution ? distribution.a.toFixed(4) : undefined
              }
            />
            <ParameterRow
              label="Upper Bound (b)"
              value={
                "b" in distribution &&
                distribution.b !== null &&
                distribution.b !== undefined
                  ? distribution.b.toFixed(4)
                  : undefined
              }
            />
          </>
        );

      case "gamma":
        return (
          <>
            <ParameterRow
              label="Shape (k)"
              value={
                "k" in distribution ? distribution.k.toFixed(4) : undefined
              }
            />
            <ParameterRow
              label="Scale (θ)"
              value={
                "theta" in distribution
                  ? distribution.theta.toFixed(4)
                  : undefined
              }
            />
          </>
        );

      case "weibull":
        return (
          <>
            <ParameterRow
              label="Shape (k)"
              value={
                "k" in distribution ? distribution.k.toFixed(4) : undefined
              }
            />
            <ParameterRow
              label="Scale (λ)"
              value={
                "lambda_param" in distribution
                  ? distribution.lambda_param.toFixed(4)
                  : undefined
              }
            />
          </>
        );

      case "truncated_normal":
        return (
          <>
            <ParameterRow
              label="Mean (μ)"
              value={
                "mu" in distribution ? distribution.mu.toFixed(4) : undefined
              }
            />
            <ParameterRow
              label="Std Dev (σ)"
              value={
                "sigma" in distribution
                  ? distribution.sigma.toFixed(4)
                  : undefined
              }
            />
            <ParameterRow
              label="Lower Bound (a)"
              value={
                "a" in distribution ? distribution.a?.toFixed(4) : undefined
              }
            />
            <ParameterRow
              label="Upper Bound (b)"
              value={
                "b" in distribution &&
                distribution.b !== null &&
                distribution.b !== undefined
                  ? distribution.b?.toFixed(4)
                  : "∞"
              }
            />
          </>
        );

      case "empirical":
        return (
          <>
            <ParameterRow
              label="Data Points"
              value={
                "data" in distribution ? distribution.data?.length : undefined
              }
            />
            <ParameterRow
              label="Method"
              value={
                "method" in distribution
                  ? distribution.method === "kde"
                    ? "Kernel Density Estimation"
                    : "Inverse Transform (ECDF)"
                  : undefined
              }
            />
            {"bandwidth" in distribution && distribution.bandwidth && (
              <ParameterRow
                label="KDE Bandwidth"
                value={distribution.bandwidth.toFixed(4)}
              />
            )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description && (
          <CardDescription className="text-sm">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-1">
        <ParameterRow
          label="Distribution Type"
          value={getDistributionName(distribution.distribution || "")}
        />
        {renderParameters()}
      </CardContent>
    </Card>
  );
};
