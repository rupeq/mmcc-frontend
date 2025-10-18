import { CheckCircle2, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import type { zSimulationRequestOutput } from "@/lib/api";

interface Props {
  parameters: z.infer<typeof zSimulationRequestOutput>;
}

const SettingRow = ({
  label,
  enabled,
  value,
}: {
  label: string;
  enabled: boolean;
  value?: string;
}) => (
  <div className="flex items-center justify-between py-2 border-b last:border-0">
    <div className="flex items-center gap-2">
      {enabled ? (
        <CheckCircle2 className="size-4 text-green-600" />
      ) : (
        <XCircle className="size-4 text-muted-foreground/50" />
      )}
      <span className="text-sm font-medium">{label}</span>
    </div>
    {value && <span className="text-sm text-muted-foreground">{value}</span>}
  </div>
);

export const DataCollectionSettings = ({ parameters }: Props) => {
  const { t } = useTranslation(["simulations"]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t(($) => $.simulationView.sections.dataCollection.title)}
        </CardTitle>
        <CardDescription>
          {t(($) => $.simulationView.sections.dataCollection.description)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        <SettingRow
          label={t(($) => $.simulationView.sections.dataCollection.ganttData)}
          enabled={parameters.collectGanttData ?? false}
          value={
            parameters.maxGanttItems
              ? t(($) => $.simulationView.sections.dataCollection.maxItems, {
                  count: parameters.maxGanttItems,
                })
              : undefined
          }
        />
        <SettingRow
          label={t(
            ($) => $.simulationView.sections.dataCollection.serviceTimes,
          )}
          enabled={parameters.collectServiceTimes ?? false}
          value={
            parameters.maxServiceTimeSamples
              ? t(($) => $.simulationView.sections.dataCollection.maxSamples, {
                  count: parameters.maxServiceTimeSamples,
                })
              : undefined
          }
        />
        <SettingRow
          label={t(
            ($) => $.simulationView.sections.dataCollection.temporalProfile,
          )}
          enabled={parameters.collectTemporalProfile ?? false}
          value={
            parameters.collectTemporalProfile
              ? t(($) => $.simulationView.sections.dataCollection.window, {
                  windowSize: parameters.temporalWindowSize,
                  interval: parameters.temporalSnapshotInterval,
                })
              : undefined
          }
        />
      </CardContent>
    </Card>
  );
};
