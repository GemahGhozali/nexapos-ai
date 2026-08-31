"use server";

import { groq } from "@/libs/groq";
import { generateSQLFromPrompt, runGeneratedSQL } from "../actions";
import { GenerativeChartSchema, GenerativeInsightInput, GenerativeInsightSchema } from "./schemas";

export async function processGenerativeInsight(data: GenerativeInsightInput) {
  const validated = GenerativeInsightSchema.safeParse(data);

  if (!validated.success) {
    return { success: false, message: "Perintah tidak valid!" };
  }

  try {
    const sql = await generateSQLFromPrompt(validated.data.prompt);

    const data = await runGeneratedSQL(sql);

    const systemPrompt = `
      [Role]
      You are an expert Data Visualization AI for a Point of Sales (POS) Dashboard.

      [Task]
      Analyze the provided SQL Query Result and format it into a JSON structure for dynamic UI chart rendering.

      [Field Renaming & Language Rules - APPROACH 2]
      1. Translate and format ALL keys in the 'data' array into clean, standard Indonesian snake_case names. For examples:
        * total_revenue / total_amount = total_omzet / total_nominal
        * total_transactions / count = total_transaksi
        * quantity = total_terjual
        * payment_method = metode_pembayaran
        * product_name = nama_produk
        * date / transaction_date = tanggal_transaksi
        * category = kategori_pengeluaran
      2. CRITICAL MATCHING RULE: 'xAxisKey' and 'chartKeys' MUST EXACTLY MATCH the renamed Indonesian keys present inside the 'data' array.

      [Chart Selection Rules]
      1. 'line' or 'area': Use for time-series trends over time (e.g., daily/monthly revenue trends).
      2. 'bar': Use for categorical comparisons or top rankings (e.g., top 10 products, expenses by category, sales per cashier).
      3. 'pie': Use ONLY for part-to-whole breakdowns with 5 or fewer categories (e.g., Cash vs Transfer payment methods). If categories exceed 5 items, fallback to 'bar'.

      [chartKeys Rules]
      1. Must contain the renamed numeric keys from the data array (e.g., ['total_omzet']).
      2. FOR PIE CHART: MUST contain EXACTLY ONE key (e.g., ['total_nominal']).
      3. NO MIXED SCALES (Single Metric Preference): NEVER mix two metrics with vastly different numerical scales in the same array (e.g., DO NOT put 'total_terjual' = 12 and 'total_omzet' = 1500000 in 'chartKeys' together). Select ONLY the single primary monetary or count metric.

      [valueFormat Rules]
      Set 'valueFormat' according to the type of value being plotted in 'chartKeys':
      - 'currency': For monetary amounts, sales, expenses, or cash values (Rupiah).
      - 'number': For unit quantities, product sales counts, or transaction volumes.
      - 'percentage': For ratios or percentage rates.

      [Data Payload Rules]
      - Pass all records from the input query result inside 'data'.
      - Translate keys as instructed, but DO NOT modify or recalculate the actual numerical or string data values.

      [Data Context]
      - User Query: "${validated.data.prompt}"
      - SQL Query Result: ${JSON.stringify(data)}
    `;

    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: validated.data.prompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "generative_insight_schema",
          strict: true,
          schema: GenerativeChartSchema.toJSONSchema(),
        },
      },
    });

    const parseResult = GenerativeChartSchema.safeParse(JSON.parse(response.choices[0].message.content || "{}"));

    if (!parseResult.success) {
      return { success: false, message: "AI gagal menghasilkan insight!" };
    }

    return { success: true, message: "Berhasil memproses insight!", data: parseResult.data };
  } catch (error) {
    console.log("❌ Process Generative Insight Error :", error);

    if (error instanceof Error) return { success: false, message: error.message };

    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}
