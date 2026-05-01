"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useSession, useSessionsList } from "@/lib/api/queries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatRange(start: string, end: string) {
  return `${formatDate(start)} – ${formatDate(end)}`;
}

// const rarityClass: Record<string, string> = {
//   consumer: "border-muted-foreground/30 bg-muted text-muted-foreground",
//   industrial: "border-sky-500/30 bg-sky-500/10 text-sky-300",
//   "mil-spec": "border-blue-500/30 bg-blue-500/10 text-blue-300",
//   restricted: "border-violet-500/30 bg-violet-500/10 text-violet-300",
//   classified: "border-pink-500/30 bg-pink-500/10 text-pink-300",
//   covert: "border-primary/40 bg-primary/15 text-primary",
// };

export function SessionsList() {
  const [selected, setSelected] = useState<number | null>(null);
  const { data: sessions, isLoading } = useSessionsList();

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <Card>
        <CardContent>
          <p className="p-6 text-center text-muted-foreground">No sessions yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-border/60 bg-card">
        <CardHeader>
          <CardTitle className="text-base font-semibold">All sessions</CardTitle>
          <CardDescription>Click a row to view drops and skins</CardDescription>
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
                <TableHead className="pr-6">
                  <span className="sr-only">Open</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session, index) => (
                <TableRow
                  key={session.id}
                  onClick={() => setSelected(session.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelected(session.id);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Open session from ${formatRange(session.dateFrom, session.dateTo)} with ${session.accountsCount} accounts`}
                  className="cursor-pointer border-border/60 transition-colors hover:bg-accent/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <TableCell className="pl-6 font-mono text-xs text-muted-foreground">{index + 1}</TableCell>
                  <TableCell className="text-sm">{formatRange(session.dateFrom, session.dateTo)}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums">{session.accountsCount}</TableCell>
                  <TableCell className="text-right font-mono font-semibold tabular-nums">
                    ${parseFloat(session.totalValue).toFixed(2)}
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <ChevronRight className="ml-auto size-4 text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl!">
          {selected !== null ? <SessionDetail id={selected} /> : null}
        </SheetContent>
      </Sheet>
    </>
  );
}

function SessionDetail({ id }: { id: number }) {
  const { data: session, isLoading } = useSession(id);

  if (isLoading)
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  if (!session) return <p>Session not found</p>;

  return (
    <>
      <SheetHeader>
        <SheetDescription>
          {formatRange(session.dateFrom, session.dateTo)} · {session.accountsCount} accounts ·{" "}
          <span className="font-mono font-semibold text-foreground">
            ${parseFloat(session.totalValue).toFixed(2)}
          </span>
        </SheetDescription>
      </SheetHeader>

      <div className="mt-6 space-y-6 px-4 pb-4">
        <section>
          <h3 className="mb-2 text-sm font-semibold">Drops</h3>
          <div className="overflow-hidden rounded-lg border border-border/60">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                    Item
                  </TableHead>
                  <TableHead></TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground text-right">
                    Qty
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {session.drops.map((drop, i) => (
                  <TableRow key={i} className="border-border/60">
                    <TableCell className="text-sm">{drop.caseName}</TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right font-mono tabular-nums">{drop.amount}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableCell className="text-sm font-semibold italic align-middle w-full">
                    |---------|
                  </TableCell>
                </TableRow>
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableCell className="text-sm font-semibold italic">Average case price:</TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-right font-mono font-semibold tabular-nums italic">
                    ${session.avgCasePrice}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-sm font-semibold">Skins</h3>
          <div className="overflow-hidden rounded-lg border border-border/60">
            {session.skins.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-border/60 hover:bg-transparent">
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                      Name
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                      Qty
                    </TableHead>
                    <TableHead className="text-right text-xs uppercase tracking-wider text-muted-foreground">
                      Value
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {session.skins.map((skin, i) => (
                    <TableRow key={i} className="border-border/60">
                      <TableCell className="text-sm">{skin.skinName}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{skin.amount}</TableCell>
                      <TableCell className="text-right font-mono font-semibold tabular-nums">
                        ${skin.price}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="border-border/60 hover:bg-transparent">
                    <TableCell className="text-sm font-semibold italic align-middle w-full">
                      |---------|
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-border/60 hover:bg-transparent">
                    <TableCell className="text-sm font-semibold italic">Average skin price:</TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right font-mono font-semibold tabular-nums italic">
                      $
                      {(
                        session.skins.reduce((sum, skin) => sum + Number(skin.price), 0) /
                        session.skins.length
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            ) : (
              <p className="p-4 text-center text-muted-foreground">No skins dropped in this session</p>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
