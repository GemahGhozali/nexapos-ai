import * as z from "zod";

export const ChatFormSchema = z.object({
  prompt: z.string().min(1),
});

export const ChatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1),
});

export const ChatHistorySchema = z.array(ChatMessageSchema).nonempty();

export const IntentSchema = z.object({
  intent: z
    .enum(["NEEDS_DATABASE", "GENERAL_CHAT"])
    .describe(
      "Use 'NEEDS_DATABASE' if question requires data to answer (transactions, revenue, products, cashiers, etc). Otherwise, use 'GENERAL_CHAT' (greetings, app help, general advice).",
    ),
});

export type ChatFormInput = z.infer<typeof ChatFormSchema>;
export type IntentInput = z.infer<typeof IntentSchema>;
export type ChatHistory = z.infer<typeof ChatHistorySchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
