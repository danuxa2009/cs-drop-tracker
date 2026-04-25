import { ArrowDownRight, ArrowUpRight, CalendarRange, DollarSign, Timer, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { avgPerWeek, netProfit, totalEarned, totalSessions } from "@/lib/farm-data";

type Stat = {
  title: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
};

const stats: Stat[] = [
  {
    title: "Total earned",
    value: `$${totalEarned.toLocaleString("en-US", { maximumFractionDigits: 2 })}`,
    delta: "+12.4%",
    trend: "up",
    hint: "vs. previous period",
    icon: DollarSign,
  },
  {
    title: "Avg / week",
    value: `$${avgPerWeek.toLocaleString("en-US", { maximumFractionDigits: 2 })}`,
    delta: "+4.1%",
    trend: "up",
    hint: "last 8 weeks",
    icon: CalendarRange,
  },
  {
    title: "Total sessions",
    value: totalSessions.toLocaleString("en-US"),
    delta: "-2.0%",
    trend: "down",
    hint: "vs. previous period",
    icon: Timer,
  },
  {
    title: "Net profit",
    value: `$${netProfit.toLocaleString("en-US", { maximumFractionDigits: 2 })}`,
    delta: netProfit >= 0 ? "+8.6%" : "-3.2%",
    trend: netProfit >= 0 ? "up" : "down",
    hint: "earned − expenses",
    icon: TrendingUp,
  },
];

export function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
