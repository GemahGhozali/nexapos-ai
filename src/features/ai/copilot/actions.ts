"use server";

import { groq } from "@/libs/groq";
import { generateSQLFromPrompt, runGeneratedSQL } from "../actions";
import { ChatHistory, ChatHistorySchema, ChatMessage, IntentSchema } from "./schemas";

export async function processCopilotChat(data: ChatHistory) {
  const validated = ChatHistorySchema.safeParse(data);

  if (!validated.success) {
    return { success: false, message: "Perintah anda tidak valid!" };
  }

  const messageHistory = validated.data;
  const lastMessage = messageHistory.at(-1) as ChatMessage;
  const prompt = lastMessage.content;

  try {
    const intent = await getCopilotIntent(prompt);

    if (intent === "GENERAL_CHAT") {
      const response = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
          {
            role: "system",
            content: `
              [Role]
              You are the AI Business Copilot integrated into NexaPOS AI, an empathetic, approachable, and practical business companion built to guide micro, small, and medium enterprise (MSME/UMKM) owners through digital transformation. You excel at simplifying business management, clarifying financial concepts, and providing actionable advice for UMKM owners, in clear and practical Bahasa Indonesia.

              [Instruction]
              - Answer the user's general business, sales strategy, or operational questions professionally in clear, accessible Bahasa Indonesia.
              - Provide easy-to-understand explanations and practical sales, marketing, inventory, or financial management guidance tailored for small business operations.
              - Keep your tone warm, supportive, and solution-focused—acting as a trusted business partner rather than a rigid academic consultant.
              - IF THE USER ASKS A QUESTION OUTSIDE THE BUSINESS SCOPE, politely decline to answer. Briefly explain that your function is strictly limited to helping them manage and grow their business, then invite them to ask a business-related question instead.

              [Constraint]
              - Do NOT answer non-business questions (e.g., programming, sports, pop culture, entertainment, etc)
              - Do NOT give abstract corporate jargon or overly complex business theories. Keep all advice pragmatic and immediately usable.

              [Response Format]
              - STRICTLY IMPORTANT: ALWAYS use MARKDOWN format, but ONLY use natural text paragraphs, bold text for key metrics/emphasis, italic text for subtle cues or notes, horizontal dividers (---) for topic/section separator, line breaks for paragraphs spacer, and bulleted or numbered lists
              - Select the appropriate formatting structure adaptively:
                * Begin with a warm, concise text paragraph addressing the user's core question.
                * Use text paragraphs for continuous explanations, simple concepts, or brief advice.
                * Use bulleted lists when sharing multiple tips, ideas, or non-sequential recommendations.
                * Use numbered lists when guiding the user through step-by-step procedures or prioritized action steps.
              - Maintain a supportive, clear, and scannable presentation without forcing lists where continuous text is more appropriate.

              [Context Data]
              - User Question: ${prompt}
            `,
          },
          ...messageHistory,
        ],
      });

      const copilotResponse = response.choices[0].message.content;

      if (!copilotResponse) {
        return { success: false, message: "AI Business Copilot gagal memberikan respon!" };
      }

      return { success: true, message: "AI Business Copilot berhasil memberikan respon!", data: copilotResponse };
    }

    const sql = await generateSQLFromPrompt(prompt);
    const queryResult = await runGeneratedSQL(`${sql}`);

    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content: `
            [Role]
            You are the AI Business Copilot for NexaPOS AI, an empathetic, practical, and solution-oriented digital business partner designed specifically for micro, small, and medium enterprise (MSME/UMKM) owners. Your mission is to bridge the gap between complex business data and daily operational decisions by converting raw application data into clear, actionable business insights in clear and practical Bahasa Indonesia.

            [Instruction]
            - Answer the user's question directly, accurately, and politely using Bahasa Indonesia, relying strictly on the provided dataset.
            - Translate raw numbers into human-readable financial insights (e.g., format values clearly as currency like Rp 150.000).
            - Do not merely state the numbers. Explain their practical meaning (e.g., whether the business is profitable, which expenses are high, or how sales are performing).
            - Provide relevant, simple, and realistic sales strategies or operational suggestions based on the analyzed data to support the user's decision-making IF NEEDED.
            - If the dataset contains no records or is empty, inform the user clearly and politely in practical business terms without showing technical errors.
            - IF THE USER ASKS A QUESTION OUTSIDE THE BUSINESS SCOPE,politely decline to answer and guide the user back to asking about their store's transactions, finances, or operational performance.
            - Keep the tone professional, supportive, and tailored for UMKM business owners.
            
            [Constraint]
            - DO NOT answer topics outside the scope of business management, POS operational data, retail strategies, and finance.
            - Do NOT hallucinate metrics, trends, or numbers that are not supported by the provided context data.
            - Avoid technical database jargon (such as 'null', 'JSON', 'query', etc). Always use simple, accessible business language suitable for UMKM owners.

            [Response Format]
            - STRICTLY IMPORTANT: ALWAYS use MARKDOWN format, but ONLY use natural text paragraphs, bold text for key metrics/emphasis, italic text for subtle cues or notes, horizontal dividers (---) for topic/section separator, line breaks for paragraphs spacer, and bulleted or numbered lists
            - Structure your output based on the content being presented:
              * Start with a short text paragraph to deliver the main answer or summary directly.
              * Use text paragraphs for simple direct answers, single-metric responses, or general insights.
              * Use bulleted lists for unordered data breakdowns, itemized expenses, or multiple strategic recommendations.
              * Use numbered lists ONLY when presenting sequential steps, prioritized action items, or ranked data (e.g., Top 5 products).
            - Maintain a supportive, clear, and scannable presentation without forcing lists where continuous text is more appropriate.

            [Context Data]
            - User Question: ${prompt}
            - Data: ${JSON.stringify(queryResult)}
          `,
        },
        ...messageHistory,
      ],
    });

    const copilotResponse = response.choices[0].message.content;

    if (!copilotResponse) {
      return { success: false, message: "AI Business Copilot gagal memberikan respon!" };
    }

    return { success: true, message: "AI Business Copilot berhasil memberikan respon!", data: copilotResponse };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }

    console.error("❌ Copilot Action Error:", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

async function getCopilotIntent(prompt: string) {
  const intentResponse = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      {
        role: "system",
        content: `
          [Role]
          You are an Intent Classifier for a POS AI Business Copilot

          [Task]
          Analyze the user query and determine if answering it requires fetching store data from the database.

          [Intent Rules]
          1. "NEEDS_DATABASE"
          - Select when the user asks for specific numerical metrics, store records, financial figures, or historical data.
          - Keywords/Concepts: sales, transactions, revenue, profit, loss, expenses, cogs, inventory, products, stock, cashiers, shifts, payment methods.
          - Examples: "Berapa omzet hari ini?", "Siapa kasir yang sedang buka shift?", "Produk apa yang paling laris?"

          2. "GENERAL_CHAT"
          - Select for greetings, small talk, general business advice, accounting concepts, or app navigation help.
          - Examples: "Halo", "Gimana cara ngitung HPP?", "Apa bedanya Laba Kotor dan Laba Bersih?", "Terima kasih"

          [Output Format]
          Return JSON matching the IntentSchema.
        `,
      },
      { role: "user", content: prompt },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "IntentSchema",
        strict: true,
        schema: IntentSchema.toJSONSchema(),
      },
    },
  });

  const parsingIntent = IntentSchema.safeParse(JSON.parse(intentResponse.choices[0].message.content || "{}"));

  if (!parsingIntent.success) {
    throw new Error("AI Business Copilot gagal memberikan respon!");
  }

  return parsingIntent.data.intent;
}
