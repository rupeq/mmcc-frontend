import { cn } from "@/lib/styles";

const Skeleton = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="skeleton"
    className={cn("bg-accent animate-pulse rounded-md", className)}
    {...props}
  />
);

export { Skeleton };
