"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSessionsList } from "@/lib/api/queries";
import { Skeleton } from "./ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  if (isLoading) {
    return <Skeleton className="h-62 w-full border-border/60" />;
  }

  const orderedSessions = sessions ?? [];

  return (
    <Card className="border-border/60 bg-card">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Recent sessions</CardTitle>
        <CardDescription>Latest farming runs across all accounts</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        {isMobile ? (
          <div className="space-y-3 px-4 pb-4">
            {orderedSessions.map((session, index) => (
              <div key={session.id} className="rounded-2xl border border-border/60 bg-muted/10 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <p className="text-xs font-mono text-muted-foreground">
                      Week {orderedSessions.length - index}
                    </p>
                    <p className="text-sm font-semibold text-foreground truncate">
                      {formatRange(session.dateFrom, session.dateTo)}
                    </p>
                    <p className="text-xs text-muted-foreground">{session.accountsCount} accounts</p>
                  </div>
                  <p className="shrink-0 whitespace-nowrap rounded-full bg-background px-3 py-1 text-sm font-semibold text-foreground shadow-sm">
                    ${session.totalValue}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableHead className="pl-6 text-xs uppercase tracking-wider text-muted-foreground">
                  Week
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
              {orderedSessions.map((session, index) => (
                <TableRow key={session.id} className="border-border/60">
                  <TableCell className="pl-6 font-mono text-xs text-muted-foreground">
                    {orderedSessions.length - index}
                  </TableCell>
                  <TableCell className="text-sm">{formatRange(session.dateFrom, session.dateTo)}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums">{session.accountsCount}</TableCell>
                  <TableCell className="text-right font-mono font-semibold tabular-nums">
                    ${session.totalValue}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
