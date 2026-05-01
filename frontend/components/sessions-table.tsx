"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSessionsList } from "@/lib/api/queries";
import { Skeleton } from "./ui/skeleton";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatRange(start: string, end: string) {
  return `${formatDate(start)} - ${formatDate(end)}`;
}

export function SessionsTable() {
  const { data: sessions, isLoading } = useSessionsList();

  if (isLoading) {
    return <Skeleton className="h-62 w-full border-border/60" />;
  }

  return (
    <Card className="border-border/60 bg-card">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Recent sessions</CardTitle>
        <CardDescription>Latest farming runs across all accounts</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <Table>
          <TableHeader>
            <TableRow className="border-border/60 hover:bg-transparent">
              <TableHead className="pl-6 text-xs uppercase tracking-wider text-muted-foreground">
                Session
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                Date range
              </TableHead>
              <TableHead className="text-right text-xs uppercase tracking-wider text-muted-foreground">
                Accounts
              </TableHead>
              <TableHead className="text-right text-xs uppercase tracking-wider text-muted-foreground">
                Total value
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions?.map((session, index) => (
              <TableRow key={session.id} className="border-border/60">
                <TableCell className="pl-6 font-mono text-xs text-muted-foreground">{index + 1}</TableCell>
                <TableCell className="text-sm">{formatRange(session.dateFrom, session.dateTo)}</TableCell>
                <TableCell className="text-right font-mono tabular-nums">{session.accountsCount}</TableCell>
                <TableCell className="text-right font-mono font-semibold tabular-nums">
                  ${session.totalValue}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
