"use client";

import { cn } from "@/libs/shadcn";
import { useState } from "react";
import { ShiftDetail } from "../types";
import { formatToIDR } from "@/utils/format-to-idr";
import { Pie, PieChart } from "recharts";
import { HugeiconsIcon } from "@hugeicons/react";
import { PieChart01Icon } from "@hugeicons/core-free-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const paymentMethodConfig = {
  "Pemasukan Tunai": {
    label: "Pemasukan Tunai",
    color: "var(--chart-3)",
  },
  "Pemasukan Transfer": {
    label: "Pemasukan Transfer",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const expenseColors = [
  "var(--color-red-900)",
  "var(--color-red-800)",
  "var(--color-red-700)",
  "var(--color-red-600)",
  "var(--color-red-500)",
  "var(--color-red-400)",
  "var(--color-red-300)",
];

interface ShiftDetailPieChartProps {
  data: ShiftDetail;
}

export function ShiftDetailPieChart({ data }: ShiftDetailPieChartProps) {
  const [activeTab, setActiveTab] = useState<"income" | "expense">("income");

  const paymentMethodData = data.paymentMethodProportion.map((item) => ({
    method: item.method === "cash" ? "Pemasukan Tunai" : "Pemasukan Transfer",
    total: item.total,
    count: item.count,
    fill: item.method === "cash" ? "var(--chart-3)" : "var(--chart-4)",
  }));

  const expenseCategoryData = data.expenseByCategory.map((item, index) => ({
    category: item.category,
    total: item.total,
    count: item.count,
    fill: expenseColors[index % expenseColors.length],
  }));

  const expenseConfig = expenseCategoryData.reduce<ChartConfig>((acc, item, index) => {
    acc[item.category] = {
      label: item.category,
      color: expenseColors[index % expenseColors.length],
    };
    return acc;
  }, {});

  const isIncomeEmpty = paymentMethodData.every((item) => item.total === 0);
  const isExpenseEmpty = expenseCategoryData.every((item) => item.total === 0);

  const renderChart = (isEmpty: boolean, chartData: unknown[], dataKey: string, nameKey: string, config: ChartConfig) => {
    const dataName = nameKey === "method" ? "transaksi" : "pengeluaran";

    if (isEmpty) {
      return (
        <div className="p-6 size-full border border-dashed rounded-lg flex flex-col justify-center items-center text-center">
          <div className="bg-primary/20 text-emerald-600 size-12 rounded-full grid place-content-center mb-3">
            <HugeiconsIcon icon={PieChart01Icon} size={24} color="currentColor" strokeWidth={1.75} />
          </div>
          <p className="font-medium text-foreground">Tidak ada data {dataName}</p>
          <p className="text-muted-foreground text-sm">Distribusi {dataName} akan ditampilkan disini.</p>
        </div>
      );
    }

    return (
      <ChartContainer config={config} className="mx-auto size-full">
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideLabel
                formatter={(value, name, item) => (
                  <div className="flex flex-col gap-1">
                    <span className="capitalize">{item.payload[methodKey(nameKey)]}</span>
                    <span className={cn("font-medium", nameKey === "method" ? "text-green-600" : "text-red-600")}>{formatToIDR(Number(value))}</span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {item.payload.count} Total {dataName}
                    </span>
                  </div>
                )}
              />
            }
          />
          <Pie data={chartData} dataKey={dataKey} nameKey={nameKey} innerRadius={80} />
          <ChartLegend content={<ChartLegendContent nameKey={nameKey} />} className="-translate-y-2 flex-wrap gap-4 *:justify-center" />
        </PieChart>
      </ChartContainer>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribusi Pemasukan & Pengeluaran</CardTitle>
        <CardDescription>Perbandingan jumlah pemasukan dan pengeluaran selama shift</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col pb-0">
        <Tabs className="flex-1 gap-6" value={activeTab} onValueChange={(value) => setActiveTab(value as "income" | "expense")}>
          <TabsList className="w-full gap-4">
            <TabsTrigger value="income" className="rounded-lg">
              Pemasukan
            </TabsTrigger>
            <TabsTrigger value="expense" className="rounded-lg">
              Pengeluaran
            </TabsTrigger>
          </TabsList>
          <TabsContent value="income" className="flex-1 flex flex-col justify-center">
            {renderChart(isIncomeEmpty, paymentMethodData, "total", "method", paymentMethodConfig)}
          </TabsContent>
          <TabsContent value="expense" className="flex-1 flex flex-col justify-center">
            {renderChart(isExpenseEmpty, expenseCategoryData, "total", "category", expenseConfig)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function methodKey(nameKey: string): string {
  return nameKey === "method" ? "method" : "category";
}
