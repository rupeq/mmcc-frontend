import { createFileRoute, redirect } from "@tanstack/react-router";

import { SignUp } from "@/features/authentication";
import { CookieUtils } from "@/lib/api/cookieUtils";

const RouteComponent = () => <SignUp />;

export const Route = createFileRoute("/signup/")({
  component: RouteComponent,
  beforeLoad: () => {
    if (CookieUtils.isAuthenticated()) {
      throw redirect({ to: "/" });
    }
  },
});
