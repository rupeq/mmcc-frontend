import { TanStackDevtools } from "@tanstack/react-devtools";
import { pacerDevtoolsPlugin } from "@tanstack/react-pacer-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import type { RouterContext } from "@/lib/tanstack";
import { queryClient } from "@/lib/tanstack";

const RootLayout = () => (
  <QueryClientProvider client={queryClient}>
    <HeadContent />
    <Outlet />
    <TanStackDevtools
      eventBusConfig={{
        debug: false,
      }}
      plugins={[
        pacerDevtoolsPlugin(),
        {
          name: "TanStack Query",
          render: <ReactQueryDevtoolsPanel />,
        },
        {
          name: "TanStack Router",
          render: <TanStackRouterDevtoolsPanel />,
        },
      ]}
    />
  </QueryClientProvider>
);

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});
