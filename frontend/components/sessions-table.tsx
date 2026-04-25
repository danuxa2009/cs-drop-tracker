import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { sessions } from "@/lib/farm-data";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatRange(start: string, end: string) {
  return `${formatDate(start)} – ${formatDate(end)}`;
}

function FinalBadge({ isFinal }: { isFinal: boolean }) {
  if (isFinal) {
    return (
      <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
        <span className="mr-1.5 size-1.5 rounded-full bg-primary" />
        Final
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="border-foreground/20 bg-accent text-foreground">
      <span className="mr-1.5 size-1.5 animate-pulse rounded-full bg-foreground/70" />
      Pending
    </Badge>
  );
}

export function SessionsTable() {
  const recent = sessions.slice(0, 6);

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
              <TableHead className="pr-6 text-xs uppercase tracking-wider text-muted-foreground">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recent.map((s) => (
              <TableRow key={s.id} className="border-border/60">
                <TableCell className="pl-6 font-mono text-xs text-muted-foreground">{s.id}</TableCell>
                <TableCell className="text-sm">{formatRange(s.startDate, s.endDate)}</TableCell>
                <TableCell className="text-right font-mono tabular-nums">{s.accounts}</TableCell>
                <TableCell className="text-right font-mono font-semibold tabular-nums">
                  ${s.totalValue.toFixed(2)}
                </TableCell>
                <TableCell className="pr-6">
                  <FinalBadge isFinal={s.isFinal} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
