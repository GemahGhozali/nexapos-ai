"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { processCopilotChat } from "./actions";
import { ChatFormInput, ChatFormSchema, ChatHistory } from "./schemas";

interface UseCopilotChatParams {
  onGetCopilotResponse: (message: string) => void;
}

export function useCopilotChat({ onGetCopilotResponse }: UseCopilotChatParams) {
  const form = useForm<ChatFormInput>({
    resolver: zodResolver(ChatFormSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ChatHistory) => {
      const response = await processCopilotChat(data);
      if (!response.data || !response.success) throw response;
      return response;
    },

    onSuccess: (response) => {
      form.reset();
      onGetCopilotResponse(response.data);
    },
  });

  return { form, mutation };
}
