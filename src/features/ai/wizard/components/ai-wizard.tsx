"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useWatch } from "react-hook-form";
import { WizardInput } from "./wizard-input";
import { HugeiconsIcon } from "@hugeicons/react";
import { useWizardInput } from "../hooks";
import { WizardVoiceButton } from "./wizard-voice-button";
import { Card, CardContent } from "@/components/ui/card";
import { RoboticIcon, SentIcon } from "@hugeicons/core-free-icons";
import { AIToolKey, WizardResultSuccess } from "../types";

interface AIWizardProps {
  placeholders: string[];
  allowedTools: AIToolKey[];
  onGetResult: (response: WizardResultSuccess) => void;
}

export function AIWizard({ placeholders, allowedTools, onGetResult }: AIWizardProps) {
  const {
    form,
    mutation: { isPending, mutate },
  } = useWizardInput({ allowedTools, onGetResult });

  const onSubmit = form.handleSubmit((data) => mutate(data));

  const prompt = useWatch({ control: form.control, name: "prompt" });

  return (
    <Card className="w-full rounded-full border-primary/20 p-0 h-auto">
      <CardContent className="p-2">
        <form onSubmit={onSubmit} className="flex items-center gap-3">
          <div className="shrink-0 flex items-center gap-2 p-1 pr-3 bg-muted border rounded-full">
            <div className="grid place-content-center size-7 rounded-full shrink-0 text-emerald-600 bg-primary/30">
              <HugeiconsIcon icon={RoboticIcon} size={16} color="currentColor" strokeWidth={1.5} />
            </div>
            <p className="text-sm">AI Wizard</p>
          </div>
          <WizardInput form={form} disabled={isPending} placeholders={placeholders} />
          {prompt.trim() !== "" ? (
            <Button type="submit" size="icon-lg" disabled={isPending}>
              {isPending ? <Spinner /> : <HugeiconsIcon icon={SentIcon} size={16} color="currentColor" strokeWidth={2} />}
            </Button>
          ) : (
            <WizardVoiceButton disabled={isPending} mutate={mutate} />
          )}
        </form>
      </CardContent>
    </Card>
  );
}
