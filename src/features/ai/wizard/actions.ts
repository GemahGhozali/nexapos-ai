"use server";

import { groq } from "@/libs/groq";
import { AI_TOOLS } from "./constants";
import { createClient } from "@/libs/supabase/server";
import { AIToolKey, WizardResponse } from "./types";
import { WizardInput, WizardSchema } from "./schemas";
import { createAIAction, getAITools, isToolRequireProductData } from "./utils";

interface ProcessWizardInputParams {
  data: WizardInput;
  allowedTools: AIToolKey[];
}

async function generateWizardSystemPrompt(allowedTools: AIToolKey[]) {
  let systemPrompt = `
    # ROLE
    You are an AI Wizard assitant, who can extract information from text.
    
    # INSTRUCTION
    Extract data from the text. Never output conversational text or explanation. Only respond with function/tool call.
  `;

  if (!isToolRequireProductData(allowedTools)) {
    return systemPrompt;
  }

  const supabase = await createClient();
  const { data } = await supabase.from("products").select("id, name, price, image");

  if (!data) return systemPrompt;

  const catalogText = data.map(({ id, name, price, image }) => `${id}:${name}:${price}:${image}`).join("|");

  systemPrompt += `\n# PRODUCTS (Match user intent to product ID):\n${catalogText}`;

  return systemPrompt;
}

export async function processWizardInput({ data, allowedTools }: ProcessWizardInputParams): Promise<WizardResponse> {
  const validated = WizardSchema.safeParse(data);

  if (!validated.success) {
    return { success: false, message: "Perintah tidak valid!" };
  }

  try {
    const tools = getAITools(allowedTools);
    const systemPrompt = await generateWizardSystemPrompt(allowedTools);

    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: validated.data.prompt },
      ],
      tools: tools,
      tool_choice: "auto",
    });

    const toolCalls = response.choices[0].message.tool_calls;

    if (toolCalls && toolCalls.length > 0) {
      for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name as AIToolKey;
        const toolConfig = AI_TOOLS[functionName];

        if (!toolConfig) continue;

        const functionArguments = JSON.parse(toolCall.function.arguments);
        const toolSchema = AI_TOOLS[functionName].metadata.schema;
        const parseResult = toolSchema.safeParse(functionArguments);

        if (parseResult.success) {
          const action = createAIAction(functionName, parseResult.data);
          return { success: true, message: toolConfig.metadata.successMessage, data: { action } };
        }
      }
    }

    return { success: false, message: "AI tidak memiliki kemampuan menjalankan perintah!" };
  } catch (error) {
    console.log("❌ Process Wizard Input Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}
