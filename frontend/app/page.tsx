import { PageHeader } from "@/components/page-header";
import { SessionsTable } from "@/components/sessions-table";
import { StatsCards } from "@/components/stats-cards";
import { WeeklyEarningsChart } from "@/components/weekly-earnings-chart";
import { sessionsApi } from "@/lib/api/client";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export default async function DashboardPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["sessions"],
    queryFn: sessionsApi.list,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <>
      <PageHeader title="Dashboard" description="Overview of your farming operation" />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <HydrationBoundary state={dehydratedState}>
          <StatsCards />
          <WeeklyEarningsChart />
          <SessionsTable />
        </HydrationBoundary>
      </main>
    </>
  );
}
