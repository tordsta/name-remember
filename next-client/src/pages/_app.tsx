import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/react";
import { QueryClient, QueryClientProvider, Hydrate } from "react-query";
import { NotifyContainer } from "@/components/Notify";
import { useRef } from "react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: {
  Component: any;
  pageProps: any;
}) {
  const queryClient = useRef<QueryClient>();

  if (!queryClient.current) {
    queryClient.current = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 15,
          refetchOnMount: false,
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
          cacheTime: 1000 * 60 * 60 * 24,
        },
      },
    });
  }

  return (
    <QueryClientProvider client={queryClient.current}>
      <Hydrate state={pageProps.dehydratedState}>
        <SessionProvider session={session}>
          <Component {...pageProps} />
          <NotifyContainer />
          <Analytics />
        </SessionProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}
