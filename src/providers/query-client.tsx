"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider as TanstackQueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

export function QueryClientProvider({ children }: { children: ReactNode }) {
  return <TanstackQueryClientProvider client={queryClient}>{children}</TanstackQueryClientProvider>;
}
