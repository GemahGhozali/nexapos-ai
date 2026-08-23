"use client";

import { toast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { processWizardInput } from "./actions";
import { WizardInput, WizardSchema } from "./schemas";
import { AIToolKey, WizardResultSuccess } from "./types";

interface UseWizardInputParams {
  allowedTools: AIToolKey[];
  onGetResult: (response: WizardResultSuccess) => void;
}

export function useWizardInput({ allowedTools, onGetResult }: UseWizardInputParams) {
  const form = useForm<WizardInput>({
    resolver: zodResolver(WizardSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: WizardInput) => {
      const response = await processWizardInput({ data, allowedTools });
      if (!response.data || !response.success) throw response;
      return response;
    },

    onSuccess: (response) => {
      form.resetField("prompt", { defaultValue: "" });
      onGetResult(response);
    },

    onError: (response) => {
      toast.add({ type: "error", description: response.message });
    },
  });

  return { form, mutation };
}
