import * as React from "react";

import type { VariantProps } from "class-variance-authority";

import { spinnerVariants } from "@/components/ui/variants";
import { cn } from "@/lib/styles";

export const Spinner = ({
  className,
  variant,
  size = "default",
}: React.HTMLAttributes<HTMLDivElement> &
  Omit<VariantProps<typeof spinnerVariants>, "size"> & {
    className?: string;
    size?: VariantProps<typeof spinnerVariants>["size"] | number;
  }) => (
  <div
    aria-label="Loading"
    role="status"
    style={typeof size === "number" ? { width: size, height: size } : undefined}
    className={cn(
      typeof size === "string"
        ? spinnerVariants({ variant, size })
        : spinnerVariants({ variant }),
      className,
    )}
  >
    {Array.from({ length: 12 }).map((_, index) => (
      <div
        key={index}
        aria-hidden="true"
        className="animate-spinner absolute top-[4.4%] left-[46.5%] h-[24%] w-[7%] origin-[center_190%] rounded-full opacity-[0.1] will-change-transform"
        style={{
          transform: `rotate(${index * 30}deg)`,
          animationDelay: `${(index * 0.083).toFixed(3)}s`,
        }}
      />
    ))}
    <span className="sr-only">Loading...</span>
  </div>
);
