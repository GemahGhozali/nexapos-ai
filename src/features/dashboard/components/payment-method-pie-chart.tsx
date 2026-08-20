"use client";

import { formatToIDR } from "@/utils/format-to-idr";
import { Pie, PieChart } from "recharts";
import { HugeiconsIcon } from "@hugeicons/react";
import { PieChart01Icon } from "@hugeicons/core-free-icons";
import { PaymentMethodProportionItem } from "../queries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  totalRevenue: {
    label: "Total Omzet",
  },
  tunai: {
    label: "Tunai",
    color: "var(--chart-3)",
  },
  transfer: {
    label: "Transfer",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

interface PaymentMethodPieChartProps {
  data: PaymentMethodProportionItem[];
}

export function PaymentMethodPieChart({ data }: PaymentMethodPieChartProps) {
  const isEmpty = data.every((item) => item.totalRevenue === 0);

  const renderChart = () => {
    if (isEmpty) {
      return (
        <div className="p-6 size-full border border-dashed rounded-lg flex flex-col justify-center items-center text-center">
          <div className="bg-primary/20 text-emerald-600 size-12 rounded-full grid place-content-center mb-3">
            <HugeiconsIcon icon={PieChart01Icon} size={24} color="currentColor" strokeWidth={1.75} />
          </div>
          <p className="font-medium text-foreground">Belum ada pemasukan apapun</p>
          <p className="text-muted-foreground text-sm">Distribusi pembayaran tunai dan transfer akan ditampilkan disini.</p>
        </div>
      );
    }

    return (
      <ChartContainer config={chartConfig} className="mx-auto size-full">
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideLabel
                formatter={(value, name, item) => (
                  <div className="flex flex-col gap-1">
                    <span className="capitalize">Omzet {item.payload.paymentMethod}</span>
                    <span className="font-medium text-emerald-600">{formatToIDR(Number(value))}</span>
                    <span className="text-xs text-muted-foreground">{item.payload.totalTransactions} Total Transaksi</span>
                  </div>
                )}
              />
            }
          />
          <Pie data={data} dataKey="totalRevenue" nameKey="paymentMethod" innerRadius={80} />
          <ChartLegend content={<ChartLegendContent nameKey="paymentMethod" />} className="-translate-y-2 flex-wrap gap-4 *:justify-center" />
        </PieChart>
      </ChartContainer>
    );
  };
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-start pb-2">
        <CardTitle>Omzet Metode Pembayaran</CardTitle>
        <CardDescription>Proporsi total omzet berdasarkan metode pembayaran</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center pb-0">{renderChart()}</CardContent>
    </Card>
  );
}
