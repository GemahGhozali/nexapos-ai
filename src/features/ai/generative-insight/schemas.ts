import * as z from "zod";

export const GenerativeInsightSchema = z.object({
  prompt: z.string().min(1),
});

export type GenerativeInsightInput = z.infer<typeof GenerativeInsightSchema>;

export const GenerativeChartSchema = z.object({
  chartType: z
    .enum(["bar", "line", "area", "pie"])
    .describe(
      "The type of chart to render: 'line'/'area' for time-series trends, 'bar' for categorical comparisons/rankings, and 'pie' for part-to-whole proportions (max 5 items).",
    ),
  xAxisKey: z
    .string()
    .describe(
      "The translated Indonesian property key in the data objects used as the category/label/date axis (e.g., 'tanggal_transaksi', 'metode_pembayaran', 'nama_produk').",
    ),
  chartKeys: z
    .array(z.string())
    .min(1)
    .describe(
      "An array of translated Indonesian numeric property keys representing the values to plot (e.g., ['total_omzet']). MUST match the renamed keys in the data payload.",
    ),
  valueFormat: z
    .enum(["currency", "number", "percentage"])
    .describe(
      "Format unit for the chart values: 'currency' for monetary values in Rupiah, 'number' for integer counts/quantities, and 'percentage' for ratios.",
    ),
  data: z.array(z.any()).min(1).describe("The processed dataset containing clean objects with translated Indonesian keys."),
});

export type GenerativeChart = z.infer<typeof GenerativeChartSchema>;
