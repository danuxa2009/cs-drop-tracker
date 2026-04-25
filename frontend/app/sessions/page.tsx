import { PageHeader } from "@/components/page-header";
import { SessionsList } from "@/components/sessions-list";

export default function SessionsPage() {
  return (
    <>
      <PageHeader title="Sessions" description="All farming sessions across your accounts" />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <SessionsList />
      </main>
    </>
  );
}
