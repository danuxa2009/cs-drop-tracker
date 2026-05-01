import { PageHeader } from "@/components/page-header";
import { SessionsList } from "@/components/sessions-list";
import { sessionsApi } from "@/lib/api/client";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export default async function SessionsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["sessions"],
    queryFn: sessionsApi.list,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <>
      <PageHeader title="Sessions" description="All farming sessions across your accounts" />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <HydrationBoundary state={dehydratedState}>
          <SessionsList />
        </HydrationBoundary>
      </main>
    </>
  );
}
