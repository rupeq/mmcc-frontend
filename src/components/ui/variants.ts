import { cva } from "class-variance-authority";

export const spinnerVariants = cva(
  "relative inline-block aspect-square transform-gpu",
  {
    variants: {
      variant: {
        default: "[&>div]:bg-foreground",
        primary: "[&>div]:bg-primary",
        secondary: "[&>div]:bg-secondary",
        destructive: "[&>div]:bg-destructive",
        muted: "[&>div]:bg-muted-foreground",
      },
      size: {
        sm: "size-4",
        default: "size-5",
        lg: "size-8",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg:not(.loading)]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg:not(.loading)]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg:not(.loading)]:px-4",
        icon: "size-9",
        smIcon: "size-7",
      },
      loading: {
        true: "text-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
