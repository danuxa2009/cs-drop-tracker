"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useSession, useSessionsList } from "@/lib/api/queries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

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
          {isMobile ? (
            <div className="space-y-2 p-4">
              {sessions.map((session, index) => (
                <Card
                  key={session.id}
                  className="cursor-pointer border-border/60 transition-colors hover:bg-accent/40"
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
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 space-y-1">
                        <p className="font-mono text-xs text-muted-foreground">Session {index + 1}</p>
                        <p className="text-sm leading-snug truncate">
                          {formatRange(session.dateFrom, session.dateTo)}
                        </p>
                        <p className="text-xs text-muted-foreground">{session.accountsCount} accounts</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <p className="font-mono text-sm font-semibold tabular-nums">
                          ${parseFloat(session.totalValue).toFixed(2)}
                        </p>
                        <span className="rounded-full border border-border/60 bg-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          View
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
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
                    <TableCell className="pl-6 font-mono text-xs text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-sm">{formatRange(session.dateFrom, session.dateTo)}</TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {session.accountsCount}
                    </TableCell>
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
          )}
        </CardContent>
      </Card>

      <Sheet open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl!">
          <SheetHeader className="pb-0!">
            <SheetTitle>Session Details</SheetTitle>
            <SheetDescription>View drops and skins from this farming session</SheetDescription>
          </SheetHeader>
          {selected !== null ? <SessionDetail id={selected} /> : null}
        </SheetContent>
      </Sheet>
    </>
  );
}

function SessionDetail({ id }: { id: number }) {
  const { data: session, isLoading } = useSession(id);
  const isMobile = useIsMobile();

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
      <SheetHeader className="pt-0!">
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
            {isMobile ? (
              <div className="divide-y divide-border/60">
                {session.drops.map((drop, i) => (
                  <div key={i} className="flex items-center justify-between p-3">
                    <span className="text-sm">{drop.caseName}</span>
                    <span className="font-mono tabular-nums">{drop.amount}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between p-3 bg-muted/20">
                  <span className="text-sm font-semibold italic">Average case price:</span>
                  <span className="font-mono font-semibold tabular-nums italic">${session.avgCasePrice}</span>
                </div>
              </div>
            ) : (
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
            )}
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-sm font-semibold">Skins</h3>
          <div className="overflow-hidden rounded-lg border border-border/60">
            {session.skins.length > 0 ? (
              isMobile ? (
                <div className="divide-y divide-border/60">
                  {session.skins.map((skin, i) => (
                    <div key={i} className="space-y-2 px-4 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <p className="min-w-0 text-sm font-medium leading-tight text-foreground truncate">
                          {skin.skinName}
                        </p>
                        <span className="shrink-0 font-mono text-sm font-semibold tabular-nums">
                          ${skin.price}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Qty: {skin.amount}</p>
                    </div>
                  ))}
                  <div className="flex items-center justify-between gap-4 px-4 py-4 bg-muted/20">
                    <span className="text-sm font-semibold italic">Average skin price:</span>
                    <span className="shrink-0 font-mono font-semibold tabular-nums italic">
                      $
                      {(
                        session.skins.reduce((sum, skin) => sum + Number(skin.price), 0) /
                        session.skins.length
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              ) : (
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
                        <TableCell className="text-sm break-words">{skin.skinName}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {skin.amount}
                        </TableCell>
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
              )
            ) : (
              <p className="p-4 text-center text-muted-foreground">No skins dropped in this session</p>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
