import { ExpensesManager } from "@/components/expenses-manager";
import { PageHeader } from "@/components/page-header";

export default function ExpensesPage() {
  return (
    <>
      <PageHeader title="Expenses" description="Track operational costs for your farm" />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <ExpensesManager />
      </main>
    </>
  );
}
