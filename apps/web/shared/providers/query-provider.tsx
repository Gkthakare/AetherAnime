'use client';

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

import { reportError } from '@/shared/lib/errors';

type QueryProviderProps = {
  children: ReactNode;
};

/**
 * Cache-level error hooks so a failed query or mutation is always recorded.
 *
 * Without these, any fetch failure whose caller does not read `error` is
 * invisible — React Query keeps the rejection inside the cache entry.
 */
function createQueryClient(): QueryClient {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        reportError('query', error, { queryKey: query.queryKey });
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        reportError('mutation', error, {
          mutationKey: mutation.options.mutationKey,
        });
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 60000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

export function QueryProvider({
  children,
}: QueryProviderProps) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
