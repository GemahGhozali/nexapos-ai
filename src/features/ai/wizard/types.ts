import * as z from "zod";
import { AI_TOOLS } from "./constants";

export type AIToolKey = keyof typeof AI_TOOLS;

type AIActionMap = {
  [K in AIToolKey]: {
    name: K;
    payload: z.infer<(typeof AI_TOOLS)[K]["metadata"]["schema"]>;
  };
};

export type AIAction = AIActionMap[AIToolKey];

export type WizardResultSuccess = {
  success: true;
  message: string;
  data: { action: AIAction };
};

export type WizardResultError = {
  success: false;
  message: string;
  data?: undefined;
};

export type WizardResponse = WizardResultSuccess | WizardResultError;
