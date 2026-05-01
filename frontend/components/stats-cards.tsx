"use client";

import { ArrowDownRight, ArrowUpRight, CalendarRange, DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "./ui/skeleton";
import { useSessionsList, useExpensesList } from "@/lib/api/queries";

function periodDelta(values: number[]): string {
  if (values.length < 2) return "";
  const mid = Math.floor(values.length / 2);
  const prev = values.slice(0, mid).reduce((s, v) => s + v, 0);
  const curr = values.slice(mid).reduce((s, v) => s + v, 0);
  if (prev === 0) return "";
  const pct = ((curr - prev) / prev) * 100;
  return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
}

export function StatsCards() {
  const { data: sessions = [], isLoading: loadingSessions } = useSessionsList();
  const { data: expenses = [], isLoading: loadingExpenses } = useExpensesList();

  const isLoading = loadingSessions || loadingExpenses;

  if (isLoading) {
    return (
      <div className="grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-38 w-full" />
        ))}
      </div>
    );
  }

  const sessionValues = sessions.map((s) => Number(s.totalValue));
  const totalEarned = sessionValues.reduce((s, v) => s + v, 0);
  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const avgPerWeek = sessions.length ? totalEarned / sessions.length : 0;
  const netProfit = totalEarned - totalExpenses;

  const earnedDelta = periodDelta(sessionValues);

  const mid = Math.floor(sessions.length / 2);
  const avgPrev = mid ? sessionValues.slice(0, mid).reduce((s, v) => s + v, 0) / mid : 0;
  const avgCurr = mid ? sessionValues.slice(mid).reduce((s, v) => s + v, 0) / (sessions.length - mid) : 0;
  const avgDelta = avgPrev
    ? `${((avgCurr - avgPrev) / avgPrev) * 100 >= 0 ? "+" : ""}${(((avgCurr - avgPrev) / avgPrev) * 100).toFixed(1)}%`
    : "";

  const stats = [
    {
      title: "Total earned",
      value: `$${totalEarned.toLocaleString("en-US", { maximumFractionDigits: 2 })}`,
      delta: earnedDelta,
      trend: (earnedDelta.startsWith("+") || earnedDelta === "" ? "up" : "down") as "up" | "down",
      hint: "vs. previous period",
      icon: DollarSign,
    },
    {
      title: "Avg / week",
      value: `$${avgPerWeek.toLocaleString("en-US", { maximumFractionDigits: 2 })}`,
      delta: avgDelta,
      trend: (avgDelta.startsWith("+") || avgDelta === "" ? "up" : "down") as "up" | "down",
      hint: `across ${sessions.length} sessions`,
      icon: CalendarRange,
    },
    {
      title: "Net profit",
      value: `$${netProfit.toLocaleString("en-US", { maximumFractionDigits: 2 })}`,
      delta:
        netProfit >= 0
          ? `+$${(totalEarned - totalExpenses).toFixed(2)}`
          : `-$${Math.abs(netProfit).toFixed(2)}`,
      trend: (netProfit >= 0 ? "up" : "down") as "up" | "down",
      hint: "earned − expenses",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight;
        return (
          <Card key={stat.title} className="border-border/60 bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className="flex size-8 items-center justify-center rounded-md bg-accent text-muted-foreground">
                <Icon className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-3xl font-semibold tracking-tight tabular-nums">{stat.value}</div>
              {stat.delta && (
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span
                    className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-medium ${
                      stat.trend === "up"
                        ? "bg-primary/15 text-primary"
                        : "bg-destructive/15 text-destructive-foreground"
                    }`}
                  >
                    <TrendIcon className="size-3" />
                    {stat.delta}
                  </span>
                  <span className="text-muted-foreground">{stat.hint}</span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
