import * as React from "react";

import { Slot, Slottable } from "@radix-ui/react-slot";
import type { VariantProps } from "class-variance-authority";
import { Loader2Icon } from "lucide-react";

import { cn } from "@/lib/styles/utils";

import { buttonVariants } from "./variants";

export const Button = ({
  className,
  variant,
  size,
  children,
  disabled,
  asChild = false,
  isLoading = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: boolean;
  }) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      disabled={disabled || isLoading}
      className={cn(
        buttonVariants({ variant, size, className, loading: isLoading }),
      )}
      {...props}
    >
      {isLoading && (
        <Loader2Icon
          className={cn("text-muted absolute animate-spin", "loading")}
        />
      )}
      <Slottable>{children}</Slottable>
    </Comp>
  );
};
