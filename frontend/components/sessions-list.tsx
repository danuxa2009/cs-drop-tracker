"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { sessions, type Session } from "@/lib/farm-data";

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

const rarityClass: Record<Session["skins"][number]["rarity"], string> = {
  consumer: "border-muted-foreground/30 bg-muted text-muted-foreground",
  industrial: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  "mil-spec": "border-blue-500/30 bg-blue-500/10 text-blue-300",
  restricted: "border-violet-500/30 bg-violet-500/10 text-violet-300",
  classified: "border-pink-500/30 bg-pink-500/10 text-pink-300",
  covert: "border-primary/40 bg-primary/15 text-primary",
};

export function SessionsList() {
  const [selected, setSelected] = useState<Session | null>(null);

  return (
    <>
      <Card className="border-border/60 bg-card">
        <CardHeader>
          <CardTitle className="text-base font-semibold">All sessions</CardTitle>
          <CardDescription>Click a row to view drops and skins for that session</CardDescription>
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
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="pr-6">
                  <span className="sr-only">Open</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((s) => (
                <TableRow
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className="cursor-pointer border-border/60 transition-colors hover:bg-accent/40"
                >
                  <TableCell className="pl-6 font-mono text-xs text-muted-foreground">{s.id}</TableCell>
                  <TableCell className="text-sm">{formatRange(s.startDate, s.endDate)}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums">{s.accounts}</TableCell>
                  <TableCell className="text-right font-mono font-semibold tabular-nums">
                    ${s.totalValue.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <FinalBadge isFinal={s.isFinal} />
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

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl!">
          {selected ? (
            <>
              <SheetHeader>
                <SheetTitle className="font-mono text-base">{selected.id}</SheetTitle>
                <SheetDescription>
                  {formatRange(selected.startDate, selected.endDate)} · {selected.accounts} accounts ·{" "}
                  <span className="font-mono font-semibold text-foreground">
                    ${selected.totalValue.toFixed(2)}
                  </span>
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6 px-4 pb-4">
                <section>
                  <div className="mb-2 flex items-baseline justify-between">
                    <h3 className="text-sm font-semibold">Drops</h3>
                    <span className="text-xs text-muted-foreground">
                      {selected.drops.length} item{selected.drops.length === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="overflow-hidden rounded-lg border border-border/60">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border/60 hover:bg-transparent">
                          <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                            Item
                          </TableHead>
                          <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                            Type
                          </TableHead>
                          <TableHead className="text-right text-xs uppercase tracking-wider text-muted-foreground">
                            Qty
                          </TableHead>
                          <TableHead className="text-right text-xs uppercase tracking-wider text-muted-foreground">
                            Value
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selected.drops.map((d) => (
                          <TableRow key={d.id} className="border-border/60">
                            <TableCell className="text-sm">{d.itemName}</TableCell>
                            <TableCell className="font-mono text-xs capitalize text-muted-foreground">
                              {d.type}
                            </TableCell>
                            <TableCell className="text-right font-mono tabular-nums">{d.quantity}</TableCell>
                            <TableCell className="text-right font-mono font-semibold tabular-nums">
                              ${d.value.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </section>

                <section>
                  <div className="mb-2 flex items-baseline justify-between">
                    <h3 className="text-sm font-semibold">Skins</h3>
                    <span className="text-xs text-muted-foreground">
                      {selected.skins.length} item{selected.skins.length === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="overflow-hidden rounded-lg border border-border/60">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border/60 hover:bg-transparent">
                          <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                            Name
                          </TableHead>
                          <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                            Wear
                          </TableHead>
                          <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                            Rarity
                          </TableHead>
                          <TableHead className="text-right text-xs uppercase tracking-wider text-muted-foreground">
                            Value
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selected.skins.map((k) => (
                          <TableRow key={k.id} className="border-border/60">
                            <TableCell className="text-sm">{k.name}</TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground">
                              {k.wear}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`capitalize ${rarityClass[k.rarity]}`}>
                                {k.rarity}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-mono font-semibold tabular-nums">
                              ${k.value.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </section>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  );
}
