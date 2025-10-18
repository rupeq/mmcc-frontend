import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation(["simulations"]);

  const getDistributionName = (type: string) => {
    const typeMap: Record<string, string> = {
      exponential: t(($) => $.distributions.types.exponential),
      uniform: t(($) => $.distributions.types.uniform),
      gamma: t(($) => $.distributions.types.gamma),
      weibull: t(($) => $.distributions.types.weibull),
      truncated_normal: t(($) => $.distributions.types.truncatedNormal),
      empirical: t(($) => $.distributions.types.empirical),
    };
    return typeMap[type] || type;
  };

  const renderParameters = () => {
    switch (distribution.distribution) {
      case "exponential":
        return (
          <ParameterRow
            label={t(($) => $.distributions.parameters.rate)}
            value={
              "rate" in distribution ? distribution.rate.toFixed(4) : undefined
            }
          />
        );
      case "uniform":
        return (
          <>
            <ParameterRow
              label={t(($) => $.distributions.parameters.lowerBound)}
              value={
                "a" in distribution ? distribution.a.toFixed(4) : undefined
              }
            />
            <ParameterRow
              label={t(($) => $.distributions.parameters.upperBound)}
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
              label={t(($) => $.distributions.parameters.shape)}
              value={
                "k" in distribution ? distribution.k.toFixed(4) : undefined
              }
            />
            <ParameterRow
              label={t(($) => $.distributions.parameters.scale)}
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
              label={t(($) => $.distributions.parameters.shape)}
              value={
                "k" in distribution ? distribution.k.toFixed(4) : undefined
              }
            />
            <ParameterRow
              label={t(($) => $.distributions.parameters.scaleWeibull)}
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
              label={t(($) => $.distributions.parameters.mean)}
              value={
                "mu" in distribution ? distribution.mu.toFixed(4) : undefined
              }
            />
            <ParameterRow
              label={t(($) => $.distributions.parameters.standardDeviation)}
              value={
                "sigma" in distribution
                  ? distribution.sigma.toFixed(4)
                  : undefined
              }
            />
            <ParameterRow
              label={t(($) => $.distributions.parameters.lowerBound)}
              value={
                "a" in distribution ? distribution.a?.toFixed(4) : undefined
              }
            />
            <ParameterRow
              label={t(($) => $.distributions.parameters.upperBound)}
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
              label={t(($) => $.distributions.parameters.observedData)}
              value={
                "data" in distribution ? distribution.data?.length : undefined
              }
            />
            <ParameterRow
              label={t(($) => $.distributions.parameters.samplingMethod)}
              value={
                "method" in distribution
                  ? distribution.method === "kde"
                    ? t(($) => $.distributions.parameters.kde)
                    : t(($) => $.distributions.parameters.inverseTransform)
                  : undefined
              }
            />
            {"bandwidth" in distribution && distribution.bandwidth && (
              <ParameterRow
                label={t(($) => $.distributions.parameters.kdeBandwidth)}
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
          label={t(($) => $.distributions.arrivalProcess.label)}
          value={getDistributionName(distribution.distribution || "")}
        />
        {renderParameters()}
      </CardContent>
    </Card>
  );
};
