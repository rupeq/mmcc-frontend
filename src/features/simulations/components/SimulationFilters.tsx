// src/features/simulations/components/SimulationFilters.tsx
import { use, useState } from "react";

import { useTranslation } from "react-i18next";
import { z } from "zod";

import {
  Button,
  Checkbox,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { SimulationsFiltersContext } from "@/features/simulations/contexts";
import { zReportStatus } from "@/lib/api";

interface Props {
  onClose?: () => void;
}

export const SimulationFilters = ({ onClose }: Props) => {
  const { t } = useTranslation(["simulations"]);
  const {
    reportStatus,
    showArchived,
    setReportStatus,
    setShowArchived,
    clearFilters,
  } = use(SimulationsFiltersContext);

  const [localReportStatus, setLocalReportStatus] = useState<
    z.infer<typeof zReportStatus> | undefined
  >(reportStatus);
  const [localShowArchived, setLocalShowArchived] = useState<true | undefined>(
    showArchived,
  );

  const handleApply = () => {
    if (localReportStatus !== reportStatus) {
      setReportStatus(localReportStatus);
    }
    if (localShowArchived !== showArchived) {
      setShowArchived(localShowArchived);
    }
    onClose?.();
  };

  const handleClear = () => {
    setLocalReportStatus(undefined);
    setLocalShowArchived(undefined);
    clearFilters();
    onClose?.();
  };

  const handleReportStatusChange = (value: string) => {
    if (value === "all") {
      setLocalReportStatus(undefined);
    } else {
      setLocalReportStatus(value as z.infer<typeof zReportStatus>);
    }
  };

  const handleIsActiveChange = (checked: boolean | "indeterminate") => {
    if (checked === "indeterminate" || !checked) {
      setLocalShowArchived(undefined);
    } else {
      setLocalShowArchived(true);
    }
  };

  const hasActiveFilters =
    reportStatus !== undefined || showArchived !== undefined;
  const hasChanges =
    localReportStatus !== reportStatus || localShowArchived !== showArchived;

  return (
    <div className="grid gap-4 ">
      <div className="space-y-1">
        <h4 className="text-sm font-semibold leading-none">
          {t(($) => $.filters.title)}
        </h4>
        <p className="text-xs text-muted-foreground">
          {t(($) => $.filters.description)}
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reportStatus" className="text-xs font-medium">
            {t(($) => $.filters.reportStatus)}
          </Label>
          <Select
            value={localReportStatus ?? "all"}
            onValueChange={handleReportStatusChange}
          >
            <SelectTrigger
              id="reportStatus"
              size="sm"
              className="w-full capitalize"
            >
              <SelectValue placeholder={t(($) => $.filters.allStatuses)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="cursor-pointer">
                <span className="font-medium">
                  {t(($) => $.filters.allStatuses)}
                </span>
              </SelectItem>
              {zReportStatus.options.map((option) => (
                <SelectItem
                  key={option}
                  value={option}
                  className="capitalize cursor-pointer"
                >
                  {t(($) => $.simulationView.statuses[option])}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-medium">
            {t(($) => $.filters.status)}
          </Label>
          <label
            htmlFor="isActive"
            className="cursor-pointer hover:bg-accent/50 flex p-3 items-start gap-3 rounded-lg border transition-colors has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950"
          >
            <Checkbox
              id="isActive"
              checked={localShowArchived ?? false}
              onCheckedChange={handleIsActiveChange}
              className="mt-0.5 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
            />
            <div className="grid gap-1 flex-1">
              <p className="text-sm font-medium leading-none">
                {t(($) => $.filters.includeArchived)}
              </p>
              <p className="text-xs text-muted-foreground leading-snug">
                {t(($) => $.filters.includeArchivedDescription)}
              </p>
            </div>
          </label>
        </div>
      </div>
      <div className="flex gap-2 pt-2 border-t">
        <Button
          onClick={handleClear}
          variant="outline"
          size="sm"
          disabled={!hasActiveFilters}
          className="flex-1"
        >
          {t(($) => $.filters.clearAll)}
        </Button>
        <Button
          onClick={handleApply}
          size="sm"
          disabled={!hasChanges}
          className="flex-1"
        >
          {t(($) => $.filters.applyFilters)}
        </Button>
      </div>
    </div>
  );
};
