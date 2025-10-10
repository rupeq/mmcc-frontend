import { useMemo } from "react";

import { createFileRoute, redirect, useSearch } from "@tanstack/react-router";

import { Simulations, simulationsSearchSchema } from "@/features/simulations";
import { CookieUtils } from "@/lib/api";

const RouteComponent = () => {
  const search = useSearch({ from: "/", select: (data) => data.search });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const defaultSearch = useMemo(() => search, []);

  return <Simulations defaultSearch={defaultSearch} />;
};

export const Route = createFileRoute("/")({
  component: RouteComponent,
  validateSearch: simulationsSearchSchema,
  beforeLoad: () => {
    if (!CookieUtils.isAuthenticated()) {
      throw redirect({ to: "/signin" });
    }
  },
});
