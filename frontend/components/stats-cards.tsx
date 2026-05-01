"use client";

import { ArrowDownRight, ArrowUpRight, CalendarRange, DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "./ui/skeleton";
import { useSessionsList, useExpensesList } from "@/lib/api/queries";

// ─── helpers ────────────────────────────────────────────────────────────────

function splitHalves<T>(arr: T[]): [T[], T[]] {
  const mid = Math.floor(arr.length / 2);
  return [arr.slice(0, mid), arr.slice(mid)];
}

function sum(values: number[]) {
  return values.reduce((acc, v) => acc + v, 0);
}

function avg(values: number[]) {
  return values.length ? sum(values) / values.length : 0;
}

function percentDelta(prev: number, curr: number): string {
  if (prev === 0) return "";
  const pct = ((curr - prev) / prev) * 100;
  return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
}

function formatUSD(value: number): string {
  return `$${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

function trendFrom(delta: string): Trend {
  return delta === "" || delta.startsWith("+") ? "up" : "down";
}

type Trend = "up" | "down";

interface StatCard {
  title: string;
  value: string;
  delta: string;
  trend?: Trend;
  hint: string;
  icon: React.ElementType;
}

export function StatsCards() {
  const { data: sessions = [], isLoading: loadingSessions } = useSessionsList();
  const { data: expenses = [], isLoading: loadingExpenses } = useExpensesList();

  if (loadingSessions || loadingExpenses) {
    return (
      <div className="grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-38 w-full" />
        ))}
      </div>
    );
  }

  const sessionValues = sessions.map((s) => Number(s.totalValue));
  const totalEarned = sum(sessionValues);
  const totalExpenses = sum(expenses.map((e) => Number(e.amount)));
  const netProfit = totalEarned - totalExpenses;
  const avgPerWeek = avg(sessionValues);

  const [prevValues, currValues] = splitHalves(sessionValues);
  const earnedDelta = percentDelta(sum(prevValues), sum(currValues));
  const avgDelta = percentDelta(avg(prevValues), avg(currValues));

  const stats: StatCard[] = [
    {
      title: "Total earned",
      value: formatUSD(totalEarned),
      delta: earnedDelta,
      trend: trendFrom(earnedDelta),
      hint: "vs. previous period",
      icon: DollarSign,
    },
    {
      title: "Avg / week",
      value: formatUSD(avgPerWeek),
      delta: avgDelta,
      trend: trendFrom(avgDelta),
      hint: `across ${sessions.length} sessions`,
      icon: CalendarRange,
    },
    {
      title: "Net profit",
      value: formatUSD(netProfit),
      delta: "",
      trend: undefined,
      hint: "earned − expenses",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {stats.map((stat) => (
        <StatCardItem key={stat.title} {...stat} />
      ))}
    </div>
  );
}

function StatCardItem({ title, value, delta, trend, hint, icon: Icon }: StatCard) {
  const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight;

  const deltaClass =
    trend === "up" ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive-foreground";

  return (
    <Card className="border-border/60 bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="flex size-8 items-center justify-center rounded-md bg-accent text-muted-foreground">
          <Icon className="size-4" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="font-mono text-3xl font-semibold tracking-tight tabular-nums">{value}</div>

        {delta && trend ? (
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span
              className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-medium ${deltaClass}`}
            >
              <TrendIcon className="size-3" />
              {delta}
            </span>
            <span className="text-muted-foreground">{hint}</span>
          </div>
        ) : (
          <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
        )}
      </CardContent>
    </Card>
  );
}
