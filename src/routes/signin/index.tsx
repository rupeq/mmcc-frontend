import { createFileRoute, redirect } from "@tanstack/react-router";

import { SignIn, signInSearchSchema } from "@/features/authentication";
import { CookieUtils } from "@/lib/api/cookieUtils";

const RouteComponent = () => <SignIn />;

export const Route = createFileRoute("/signin/")({
  component: RouteComponent,
  validateSearch: signInSearchSchema,
  beforeLoad: () => {
    if (CookieUtils.isAuthenticated()) {
      throw redirect({ to: "/" });
    }
  },
});
