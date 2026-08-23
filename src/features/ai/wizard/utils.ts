import * as z from "zod";
import Groq from "groq-sdk";
import { AI_TOOLS } from "./constants";
import { AIAction, AIToolKey } from "./types";

export function getAITools(allowedTools: AIToolKey[]): Groq.Chat.Completions.ChatCompletionTool[] {
  return allowedTools.map((key) => AI_TOOLS[key].definition).filter(Boolean);
}

export function isToolRequireProductData(allowedTools: AIToolKey[]): boolean {
  return allowedTools.some((key) => AI_TOOLS[key].metadata.requireProductData);
}

export function createAIAction<T extends AIToolKey>(name: T, payload: z.infer<(typeof AI_TOOLS)[T]["metadata"]["schema"]>): AIAction {
  return { name, payload } as AIAction;
}
