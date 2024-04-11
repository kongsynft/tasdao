"use client";

import { CONNECTED_WALLET_KEY, IS_CONNECTED_KEY } from "@/lib/cardano/hooks";
import {
  AreKeysEqual,
  localStoragePersistor,
  queryClient,
} from "@/lib/queryUtils";
import { DehydrateOptions, QueryKey } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

const persistQueries: QueryKey[] = [IS_CONNECTED_KEY, CONNECTED_WALLET_KEY];
const dehydrateOptions: DehydrateOptions = {
  shouldDehydrateQuery: ({ queryKey }) => {
    for (const key of persistQueries) {
      if (AreKeysEqual(queryKey, key)) return true;
    }
    return false;
  },
};
const persistOptions = {
  persister: localStoragePersistor,
  hydrateOptions: {},
  dehydrateOptions: dehydrateOptions,
};

export default function Provider({ children }: any) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={persistOptions}
    >
      {children}
      <ReactQueryDevtools initialIsOpen={true} />
    </PersistQueryClientProvider>
  );
}
