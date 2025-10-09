import { type ComponentProps } from "react";

import { Spinner } from "@/components/ui";

export const FullPageSpinner = (props: ComponentProps<typeof Spinner>) => (
  <div className="container flex h-screen items-center justify-center">
    <Spinner {...props} />
  </div>
);
