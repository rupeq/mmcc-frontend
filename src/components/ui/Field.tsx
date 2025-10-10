import * as React from "react";

import { cn } from "@/lib/styles";

export const FieldGroup = ({
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div
    data-slot="field-group"
    className={cn(
      "group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4",
      className,
    )}
    {...props}
  />
);

export const FieldLegend = ({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) => (
  <legend
    data-slot="field-legend"
    data-variant={variant}
    className={cn(
      "mb-3 font-medium",
      "data-[variant=legend]:text-base",
      "data-[variant=label]:text-sm",
      className,
    )}
    {...props}
  />
);

export const FieldSet = ({
  className,
  ...props
}: React.ComponentProps<"fieldset">) => (
  <fieldset
    data-slot="field-set"
    className={cn(
      "flex flex-col gap-6",
      "has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
      className,
    )}
    {...props}
  />
);
