import { Field } from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTypewriter } from "@/hooks/use-typewriter";
import { transcribeAudio } from "../../actions";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";
import { Card, CardContent } from "@/components/ui/card";
import { useGenerativeInsight } from "../hooks";
import { Controller, UseFormReturn, useWatch } from "react-hook-form";
import { Mic02Icon, SparklesIcon, SquareIcon, SentIcon } from "@hugeicons/core-free-icons";
import { GenerativeChart, GenerativeInsightInput as GenerativeInsightInputType } from "../schemas";

interface GenerativeInsightInputProps {
  onGetResult: (data: GenerativeChart) => void;
}

export function GenerativeInsightInput({ onGetResult }: GenerativeInsightInputProps) {
  const {
    form,
    mutation: { isPending, mutate },
  } = useGenerativeInsight({ onGetResult });

  const onSubmit = form.handleSubmit((data) => mutate(data));

  const prompt = useWatch({ control: form.control, name: "prompt" });

  return (
    <Card className="w-full rounded-full border-primary/20 p-0 h-auto">
      <CardContent className="p-2">
        <form onSubmit={onSubmit} className="flex items-center gap-3">
          <div className="shrink-0 flex items-center gap-2 p-1 pr-3 bg-muted border rounded-full">
            <div className="grid place-content-center size-7 rounded-full shrink-0 text-emerald-600 bg-primary/30">
              <HugeiconsIcon icon={SparklesIcon} size={16} color="currentColor" strokeWidth={1.5} />
            </div>
            <p className="text-sm">AI Insight</p>
          </div>
          <PromptInput
            form={form}
            disabled={isPending}
            placeholders={["Top 3 produk terlaris...", "Proporsi pengeluaran operasional bulan ini...", "Tren transaksi 1 minggu terakhir..."]}
          />
          {prompt.trim() !== "" ? (
            <Button type="submit" size="icon-lg" disabled={isPending}>
              {isPending ? <Spinner /> : <HugeiconsIcon icon={SentIcon} size={16} color="currentColor" strokeWidth={2} />}
            </Button>
          ) : (
            <VoiceInput disabled={isPending} mutate={mutate} />
          )}
        </form>
      </CardContent>
    </Card>
  );
}

interface PromptInputProps {
  form: UseFormReturn<GenerativeInsightInputType>;
  disabled: boolean;
  placeholders: string[];
}

export function PromptInput({ form, disabled, placeholders }: PromptInputProps) {
  const prompt = useWatch({ control: form.control, name: "prompt" });

  const animatedPlaceholder = useTypewriter({
    words: placeholders,
    typingSpeed: 40,
    deletingSpeed: 25,
    pauseDuration: 1500,
    enabled: prompt.trim() === "",
  });

  return (
    <Controller
      name="prompt"
      control={form.control}
      render={({ field }) => (
        <Field>
          <input
            {...field}
            id="prompt"
            type="text"
            placeholder={animatedPlaceholder}
            autoComplete="off"
            className="focus:outline-none"
            disabled={disabled}
          />
        </Field>
      )}
    />
  );
}

interface WizardVoiceButtonProps {
  disabled: boolean;
  mutate: (data: GenerativeInsightInputType) => void;
}

export function VoiceInput({ disabled, mutate }: WizardVoiceButtonProps) {
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

    mutate({ prompt: response.data });

    setIsTranscribing(false);
  };

  const isBusy = disabled || isTranscribing;

  return (
    <Button
      type="button"
      size="icon-lg"
      variant={isRecording ? "destructive" : "secondary"}
      onClick={handleMicClick}
      disabled={isBusy}
      className={isRecording ? "animate-pulse" : ""}
    >
      {isTranscribing ? (
        <Spinner />
      ) : isRecording ? (
        <HugeiconsIcon icon={SquareIcon} size={16} color="currentColor" strokeWidth={1.5} />
      ) : (
        <HugeiconsIcon icon={Mic02Icon} size={16} color="currentColor" strokeWidth={1.5} />
      )}
    </Button>
  );
}
