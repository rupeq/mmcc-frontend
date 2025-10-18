import { CheckCircle2, XCircle } from "lucide-react";
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

export const DataCollectionSettings = ({ parameters }: Props) => (
  <Card>
    <CardHeader>
      <CardTitle>Data Collection Settings</CardTitle>
      <CardDescription>
        Configuration for data collection during simulation
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-1">
      <SettingRow
        label="Gantt Chart Data"
        enabled={parameters.collectGanttData ?? false}
        value={
          parameters.maxGanttItems
            ? `Max ${parameters.maxGanttItems.toLocaleString()} items`
            : undefined
        }
      />
      <SettingRow
        label="Service Times"
        enabled={parameters.collectServiceTimes ?? false}
        value={
          parameters.maxServiceTimeSamples
            ? `Max ${parameters.maxServiceTimeSamples.toLocaleString()} samples`
            : undefined
        }
      />
      <SettingRow
        label="Temporal Profile"
        enabled={parameters.collectTemporalProfile ?? false}
        value={
          parameters.collectTemporalProfile
            ? `Window: ${parameters.temporalWindowSize}, Interval: ${parameters.temporalSnapshotInterval}`
            : undefined
        }
      />
    </CardContent>
  </Card>
);
