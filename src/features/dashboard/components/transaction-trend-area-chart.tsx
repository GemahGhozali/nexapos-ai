"use client";

import { formatToIDR } from "@/utils/format-to-idr";
import { HugeiconsIcon } from "@hugeicons/react";
import { TransactionTrendItem } from "../queries";
import { TransactionHistoryIcon } from "@hugeicons/core-free-icons";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  totalRevenue: {
    label: "Total Omzet",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface TransactionTrendAreaChartProps {
  data: TransactionTrendItem[];
}

export function TransactionTrendAreaChart({ data }: TransactionTrendAreaChartProps) {
  const isEmpty = data.length === 0;

  const renderChart = () => {
    if (isEmpty) {
      return (
        <div className="p-6 h-[250px] border border-dashed rounded-lg flex flex-col justify-center items-center text-center">
          <div className="bg-primary/20 text-emerald-600 size-12 rounded-full grid place-content-center mb-3">
            <HugeiconsIcon icon={TransactionHistoryIcon} size={24} color="currentColor" strokeWidth={1.5} />
          </div>
          <p className="font-medium text-foreground">Belum ada aktivitas transaksi</p>
          <p className="text-muted-foreground text-sm">Grafik omzet dan volume penjualan akan ditampilkan di sini.</p>
        </div>
      );
    }

    return (
      <ChartContainer config={chartConfig} className="h-[250px] w-full">
        <AreaChart
          accessibilityLayer
          data={data}
          margin={{
            left: 12,
            right: 12,
            top: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis dataKey="time" tickLine={false} tickMargin={8} />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                formatter={(value, name, item) => (
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-emerald-600">{formatToIDR(Number(value))}</span>
                    <span className="text-xs text-muted-foreground">{item.payload.totalTransactions} Total Transaksi</span>
                  </div>
                )}
              />
            }
          />
          <Area
            dataKey="totalRevenue"
            type="natural"
            fill="var(--color-totalRevenue)"
            fillOpacity={0.25}
            stroke="var(--color-totalRevenue)"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    );
  };

  return (
    <Card className="col-span-1 md:col-span-3 flex flex-col h-full">
      <CardHeader>
        <CardTitle>Tren Transaksi Shift</CardTitle>
        <CardDescription>Fluktuasi omset dan volume transaksi selama shift berjalan</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-end">{renderChart()}</CardContent>
    </Card>
  );
}
