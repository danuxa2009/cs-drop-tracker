"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useSessionsList } from "@/lib/api/queries";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Skeleton } from "./ui/skeleton";

const chartConfig = {
  earned: {
    label: "Earned",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function WeeklyEarningsChart() {
  const { data: sessions, isLoading } = useSessionsList();

  const last8 = sessions ? sessions.slice(0, 8) : [];
  const orderedSessions = [...last8].reverse();

  if (isLoading) {
    return <Skeleton className="h-70 w-full border-border/60" />;
  }

  const weeklyEarnings = orderedSessions.map((session, index) => {
    return {
      week: `Week ${index + 1}`,
      earned: Number(session.totalValue),
    };
  });

  return (
    <Card className="border-border/60 bg-card">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold">Weekly earnings</CardTitle>
          <CardDescription>Last 8 weeks of farming output</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-70 w-full">
          <BarChart data={weeklyEarnings} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              stroke="var(--muted-foreground)"
              fontSize={12}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              stroke="var(--muted-foreground)"
              fontSize={12}
              tickFormatter={(v) => `$${v}`}
            />
            <ChartTooltip
              cursor={{ fill: "var(--accent)", opacity: 0.4 }}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  formatter={(value) => [
                    `$${Number(value).toLocaleString("en-US", { maximumFractionDigits: 2 })}`,
                    " Earned",
                  ]}
                />
              }
            />
            <Bar dataKey="earned" fill="var(--color-earned)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
