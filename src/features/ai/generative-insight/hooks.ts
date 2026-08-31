"use client";

import { toast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { GenerativeChart, GenerativeInsightInput, GenerativeInsightSchema } from "./schemas";
import { processGenerativeInsight } from "./actions";

interface UseGenerativeInsightInput {
  onGetResult: (data: GenerativeChart) => void;
}

export function useGenerativeInsight({ onGetResult }: UseGenerativeInsightInput) {
  const form = useForm<GenerativeInsightInput>({
    resolver: zodResolver(GenerativeInsightSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: GenerativeInsightInput) => {
      const response = await processGenerativeInsight(data);
      if (!response.data || !response.success) throw response;
      return response;
    },

    onSuccess: (response) => {
      form.resetField("prompt", { defaultValue: "" });
      onGetResult(response.data);
    },

    onError: (response) => {
      toast.add({ type: "error", description: response.message });
    },
  });

  return { form, mutation };
}
