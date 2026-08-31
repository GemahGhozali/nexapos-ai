"use client";

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Area, AreaChart, Bar, BarChart, Line, LineChart, Pie, PieChart, XAxis, Cell } from "recharts";

const CHART_COLORS = ["var(--chart-5)", "var(--chart-4)", "var(--chart-3)", "var(--chart-2)", "var(--chart-1)"];

export type DynamicChartProps<T> = {
  data: T[];
  xAxisKey: Extract<keyof T, string>;
  chartKeys: Extract<keyof T, string>[];
  chartType: "line" | "bar" | "area" | "pie";
};

export function formatLabel(key: string): string {
  return (
    key
      // Ganti underscore (_) dan hyphen (-) dengan spasi
      .replace(/[_-]+/g, " ")

      // Sisipkan spasi sebelum huruf kapital (untuk camelCase/PascalCase)
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")

      // Bersihkan spasi ganda dan spasi di awal/akhir
      .trim()

      // Ubah huruf pertama setiap kata menjadi Kapital (Title Case)
      .replace(/\b\w/g, (char) => char.toUpperCase())
  );
}

export function generateChartConfig<T>({ data, xAxisKey, chartKeys, chartType }: DynamicChartProps<T>): ChartConfig {
  const config: ChartConfig = {};

  if (chartType === "pie") {
    const uniqueCategories = Array.from(new Set(data.map((item) => String(item[xAxisKey]))));

    uniqueCategories.forEach((category, index) => {
      config[category] = {
        label: category,
        color: CHART_COLORS[index % CHART_COLORS.length],
      };
    });
  } else {
    chartKeys.forEach((key, index) => {
      config[key] = {
        label: formatLabel(String(key)),
        color: CHART_COLORS[index % CHART_COLORS.length],
      };
    });
  }

  return config;
}

export function DynamicChart<T>({ chartType, data, xAxisKey, chartKeys }: DynamicChartProps<T>) {
  const chartConfig = generateChartConfig({ data, xAxisKey, chartKeys, chartType });
  console.log(chartConfig);

  const renderChart = () => {
    if (chartType === "bar") {
      return <BarChartComponent data={data} xAxisKey={xAxisKey} chartKeys={chartKeys} />;
    }

    if (chartType === "line") {
      return <LineChartComponent data={data} xAxisKey={xAxisKey} chartKeys={chartKeys} />;
    }

    if (chartType === "area") {
      return <AreaChartComponent data={data} xAxisKey={xAxisKey} chartKeys={chartKeys} />;
    }

    return <PieChartComponent data={data} xAxisKey={xAxisKey} chartKeys={chartKeys} />;
  };

  return (
    <ChartContainer config={chartConfig} className="mx-auto size-full px-6 pt-6">
      {renderChart()}
    </ChartContainer>
  );
}

function AreaChartComponent<T>({ data, xAxisKey, chartKeys }: Omit<DynamicChartProps<T>, "chartType">) {
  return (
    <AreaChart accessibilityLayer data={data}>
      <XAxis dataKey={xAxisKey} tickLine={false} axisLine={false} tickMargin={8} />
      <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
      {chartKeys.map((value) => (
        <Area key={value} dataKey={value} fill={`var(--color-${value})`} stroke={`var(--color-${value})`} type="natural" fillOpacity={0.4} />
      ))}
    </AreaChart>
  );
}

function LineChartComponent<T>({ data, xAxisKey, chartKeys }: Omit<DynamicChartProps<T>, "chartType">) {
  return (
    <LineChart accessibilityLayer data={data}>
      <XAxis dataKey={xAxisKey} tickLine={false} axisLine={false} tickMargin={8} />
      <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
      {chartKeys.map((value) => (
        <Line key={value} dataKey={value} stroke={`var(--color-${value})`} type="natural" strokeWidth={2} activeDot={{ r: 6 }} />
      ))}
    </LineChart>
  );
}

function BarChartComponent<T>({ data, xAxisKey, chartKeys }: Omit<DynamicChartProps<T>, "chartType">) {
  return (
    <BarChart accessibilityLayer data={data}>
      <XAxis dataKey={xAxisKey} tickLine={false} tickMargin={10} axisLine={false} />
      <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
      {chartKeys.map((value) => (
        <Bar key={value} dataKey={value} radius={8} fill={`var(--color-${value})`} />
      ))}
    </BarChart>
  );
}

function PieChartComponent<T>({ data, xAxisKey, chartKeys }: Omit<DynamicChartProps<T>, "chartType">) {
  const dataKey = chartKeys[0];

  return (
    <PieChart>
      <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
      <Pie data={data} nameKey={xAxisKey} dataKey={dataKey} innerRadius={80}>
        {data.map((entry, index) => {
          const categoryName = entry[xAxisKey];
          return <Cell key={`cell-${index}`} fill={`var(--color-${categoryName})`} />;
        })}
      </Pie>
    </PieChart>
  );
}
