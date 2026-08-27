"use client";

import { Spinner } from "@/components/ui/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import { UseMutationResult } from "@tanstack/react-query";
import { Controller, UseFormReturn } from "react-hook-form";
import { ChatFormInput, ChatHistory } from "../schemas";
import { ArrowUp02Icon, Mic02Icon } from "@hugeicons/core-free-icons";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from "@/components/ui/input-group";

interface ChatInputProps {
  form: UseFormReturn<ChatFormInput>;
  mutation: UseMutationResult<{ success: boolean; message: string; data: string }, Error, ChatHistory, unknown>;
  messages: ChatHistory;
  setMessages: React.Dispatch<React.SetStateAction<ChatHistory>>;
}

export function ChatInput({ mutation, form, messages, setMessages }: ChatInputProps) {
  const onSubmit = form.handleSubmit((data) => {
    const messageHistory: ChatHistory = [...messages, { role: "user", content: data.prompt }];
    setMessages(messageHistory);
    mutation.mutate(messageHistory);
  });

  return (
    <form onSubmit={onSubmit} className="w-full">
      <InputGroup className="*:p-3!">
        <Controller
          name="prompt"
          control={form.control}
          render={({ field }) => (
            <InputGroupTextarea
              {...field}
              id="prompt"
              rows={3}
              placeholder="Tanya AI Business Copilot..."
              autoComplete="off"
              disabled={mutation.isPending}
              className="resize-none overflow-y-auto w-full focus:shadow-none!"
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  if (form.formState.isValid && !mutation.isPending) {
                    onSubmit();
                  }
                }
              }}
            />
          )}
        />
        <InputGroupAddon align="block-end">
          <InputGroupButton variant="outline" size="icon-sm" className="ml-auto" disabled={mutation.isPending}>
            <HugeiconsIcon icon={Mic02Icon} size={12} color="currentColor" strokeWidth={1.75} />
          </InputGroupButton>
          <InputGroupButton variant="default" size="icon-sm" type="submit" disabled={!form.formState.isValid || mutation.isPending}>
            {mutation.isPending ? <Spinner /> : <HugeiconsIcon icon={ArrowUp02Icon} size={8} color="currentColor" strokeWidth={1.75} />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
