import { createFileRoute, redirect, useSearch } from "@tanstack/react-router";

import { SignIn, signInSearchSchema } from "@/features/authentication";
import { CookieUtils } from "@/lib/api";

const RouteComponent = () => {
  const defaultEmail = useSearch({
    select: (params) => params.email,
    from: "/signin/",
  });

  return <SignIn defaultEmail={defaultEmail} />;
};

export const Route = createFileRoute("/signin/")({
  component: RouteComponent,
  validateSearch: signInSearchSchema,
  beforeLoad: () => {
    if (CookieUtils.isAuthenticated()) {
      throw redirect({ to: "/" });
    }
  },
});
