import { createRouter } from "@tanstack/react-router";

import { queryClient } from "@/lib/tanstack/tanstack-query";
import { routeTree } from "@/routeTree.gen";

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});
