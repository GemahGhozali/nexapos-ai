"use server";

import * as z from "zod";
import { groq } from "@/libs/groq";
import { createClient } from "@/libs/supabase/server";

export async function transcribeAudio(formData: FormData) {
  try {
    const file = formData.get("file") as File;

    if (!file) {
      return { success: false, message: "Gagal memproses perintah suara!" };
    }

    const transcription = await groq.audio.transcriptions.create({
      file: file,
      model: "whisper-large-v3-turbo",
      language: "id",
      response_format: "json",
    });

    return { success: true, message: "Berhasil memproses perintah suara!", data: transcription.text };
  } catch (error) {
    console.log("❌ Transcribe Audio Error :", error);
    return { success: false, message: "Gagal memproses perintah suara!" };
  }
}

export async function generateSQLFromPrompt(prompt: string) {
  const systemPrompt = `
    [Instruction]
    You are an expert PostgreSQL Query Generator for a Point of Sales (POS) system. Your task is to convert user requests into a single, valid, READ-ONLY SQL query

    [User Context]
    - The caller is a STORE ADMIN/OWNER viewing the business dashboard.
    - All questions refer to the ENTIRE BUSINESS / STORE SYSTEM, NOT an individual user or single cashier.
    - NEVER add filters like 'WHERE user_id = ...' or when the user says "saya/my", UNLESS they explicitly mention a specific person's name (e.g., "pengeluaran oleh kasir Budi").

    [Tables & Relations]
    1. profiles
      * id : uuid
      * fullname : text
    
    2. shifts: 
      * id : uuid
      * user_id : FK profiles.id
      * opening_cash : numeric
      * closing_cash : numeric | null
      * expected_cash : numeric | null
      * cash_difference (Selisih Kas) : numeric | null
      * status : enum('open','closed')
      * opened_at : timestampz
      * closed_at : timestampz
    
    3. transactions: 
      * id : uuid
      * shift_id FK shifts.id
      * date : timestampz
      * total_amount (Total Harga) : numeric
      * payment_method : enum('cash','transfer')
      * paid_amount (Total Bayar) : numeric
      * change_amount (Total Kembalian) : numeric
      
    4. transaction_items: 
      * id : uuid
      * transaction_id : FK transactions.id
      * product_name : text
      * price_at_sale : numeric
      * hpp_at_sale : numeric
      * quantity : numeric
      * subtotal (Total Harga) : numeric
      
    5. expenses: 
      * id : uuid
      * shift_id : FK shifts.id
      * user_id : FK profiles.id
      * category : text
      * amount : numeric
      * payment_method : enum('cash','transfer')
      * date : timestampz

    [Profit Loss Calculation Rules (MAKE SURE TO DO IT IN ORDER, FROM TOP TO BELOW)]
    - Gross Sales / Omzet = SUM(total_amount) FROM transactions
    - COGS / HPP = SUM(hpp_at_sale * quantity) FROM transaction_items
    - Gross Profit / Laba Kotor = Gross Sales - Total COGS
    - Total Expenses / Pengeluaran = SUM(amount) FROM expenses
    - Net Profit / Laba Bersih = Gross Profit - Total Expenses

    [SQL Rules]
    - Ensure the SQL query is complete and never cut off
    - Output MUST be a valid JSON object: { "sql": "SQL_QUERY_HERE" }
    - ONLY generate 'SELECT' queries. Never use INSERT, UPDATE, DELETE, or DROP
    - Output raw SQL string only inside the JSON object without any Markdown formatting or code blocks
    - DO NOT include a trailing semicolon (;) at the end of the SQL statement
    - DO NOT join table if the required data is not there
    - DO NOT include ID columns in the SELECT output unless explicitly asked. Focus on human-readable labels and aggregate values
    - NEVER use ANY parameter placeholders ('?', ':id', '$1', etc). Always write fully executable standard SQL

    [Table Mapping & Performance Rules]
    - Expenses / Pengeluaran -> Query 'expenses' table.
    - Sales / Omzet / Total Transaksi -> Query 'transactions' table.
    - Top Products / Terlaris / HPP -> Query 'transaction_items' table.
    - Shift History / Cashier Activity -> Join 'shifts' AND 'profiles' ON shifts.user_id = profiles.id.
    - CRITICAL: DO NOT directly JOIN 'transactions' and 'transaction_items' for aggregate SUM functions to avoid duplicate/multiplied sum results.

    [Query Intent Guidelines]
    - Best-selling / Top products: Return product_name, total quantity sold (SUM(quantity)), and total revenue (SUM(subtotal)). Group by product_name and order by total quantity descending.
    - User/Cashier Shift History: Return profile's fullname, opened_at, closed_at, status, and cash_difference. Join 'shifts' with 'profiles'.
    - Expense breakdown/history: Return date, category, and total amount spent (SUM(amount) or amount). Group by category/date when aggregating.
    - Transaction Volume Trend: Return truncated date (e.g., DATE(date)) and count of transactions (COUNT(id)) or total sales (SUM(total_amount)) grouped by date.
  `;

  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "sql_response",
        strict: true,
        schema: z.object({ sql: z.string().describe("The generated SQL query") }).toJSONSchema(),
      },
    },
    temperature: 0.0,
    top_p: 0.1,
  });

  const rawResult = JSON.parse(response.choices[0].message.content || "{}");
  const result = z.object({ sql: z.string() }).safeParse(rawResult);

  if (!result.success) throw new Error("AI gagal memproses data!");

  return result.data.sql;
}

export async function runGeneratedSQL(generatedSql: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("execute_readonly_query", { query_text: generatedSql });

  if (error) {
    console.log("❌ Run Generated SQL Error:", error);
    throw new Error("AI gagal memproses data!");
  }

  return data;
}
