"use client";

import { cn } from "@/libs/shadcn";
import { toast } from "@/components/ui/toast";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { transcribeAudio } from "../../actions";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";
import { UseMutationResult } from "@tanstack/react-query";
import { Controller, UseFormReturn } from "react-hook-form";
import { ChatFormInput, ChatHistory } from "../schemas";
import { ArrowUp02Icon, Mic02Icon, SquareIcon } from "@hugeicons/core-free-icons";
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

  const { isRecording, startRecording, stopRecording } = useAudioRecorder();

  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);

  const handleMicClick = async () => {
    if (!isRecording) {
      try {
        await startRecording();
      } catch (error) {
        if (error instanceof Error) {
          toast.add({ type: "error", description: error.message });
        }
      }

      return;
    }

    const audioBlob = await stopRecording();

    if (!audioBlob) return;

    setIsTranscribing(true);

    const formData = new FormData();
    formData.append("file", audioBlob, "voice-command.webm");

    const response = await transcribeAudio(formData);

    if (!response.success || !response.data) {
      return toast.add({ type: "error", description: response.message });
    }

    const messageHistory: ChatHistory = [...messages, { role: "user", content: response.data }];
    setMessages(messageHistory);
    mutation.mutate(messageHistory);

    setIsTranscribing(false);
  };

  const isBusy = mutation.isPending || isTranscribing;

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
          <InputGroupButton
            size="icon-sm"
            disabled={isBusy}
            variant={isRecording ? "destructive" : "outline"}
            onClick={handleMicClick}
            className={cn("ml-auto", isRecording && "animate-pulse")}
          >
            {isTranscribing ? (
              <Spinner />
            ) : isRecording ? (
              <HugeiconsIcon icon={SquareIcon} size={12} color="currentColor" strokeWidth={1.5} />
            ) : (
              <HugeiconsIcon icon={Mic02Icon} size={12} color="currentColor" strokeWidth={1.75} />
            )}
          </InputGroupButton>
          <InputGroupButton variant="default" size="icon-sm" type="submit" disabled={!form.formState.isValid || isBusy}>
            {mutation.isPending ? <Spinner /> : <HugeiconsIcon icon={ArrowUp02Icon} size={8} color="currentColor" strokeWidth={1.75} />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
