import { PageHeader } from "@/components/page-header";
import { SessionsTable } from "@/components/sessions-table";
import { StatsCards } from "@/components/stats-cards";
import { WeeklyEarningsChart } from "@/components/weekly-earnings-chart";

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" description="Overview of your farming operation" />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <StatsCards />
        <WeeklyEarningsChart />
        <SessionsTable />
      </main>
    </>
  );
}
